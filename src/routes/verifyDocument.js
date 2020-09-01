const express = require("express");
const moment = require("moment");
const hash = require("object-hash");
const dz = require("../apis/datazoo-idu");
const pool = require("../database/connection");
const validateSchema = require("../utils/validateSchema");
const { getVerifyDatasource } = require("../apis/datazooHelpers");
const {
  NZDriversLicenceVerificationSchema,
  AUDriversLicenceVerificationSchema,
  PassportVerificationSchema,
  MedicareCardVerificationSchema,
} = require("../schema/verifyDocument");
const {
  reformatPassportInput,
  reformatMedicareInput,
  reformatDriversLicenseInput,
  reformatDriversLicenseOutput,
  reformatMedicareOutput,
} = require("../apis/datazooHelpers");
const errorLog = require("../utils/errorLogger");

const router = express.Router();

router.post("/:document", async (req, res) => {
  try {
    if (!req.params.document.match(/^(driverslicence|passport|medicarecard)$/))
      throw { status: 404, error: "Not a valid endpoint" };

    const hashedRequest = hash(req.body);
    let schema;
    let inputMunger;
    switch (true) {
      case req.params.document === "driverslicence" &&
        req.body.countryCode === "AU":
        schema = AUDriversLicenceVerificationSchema;
        inputMunger = reformatDriversLicenseInput;
        break;
      case req.params.document === "driverslicence" &&
        req.body.countryCode === "NZ":
        schema = NZDriversLicenceVerificationSchema;
        inputMunger = reformatDriversLicenseInput;
        break;
      case req.params.document === "passport" && req.body.countryCode === "AU":
        schema = PassportVerificationSchema;
        inputMunger = reformatPassportInput;
        break;
      case req.params.document === "medicarecard" &&
        req.body.countryCode === "AU":
        schema = MedicareCardVerificationSchema;
        inputMunger = reformatMedicareInput;
        break;
      default:
        // Throw if a schema isn't found.
        throw {
          status: 400,
          error:
            "Unable to validate request. Medicare and Passport requests are only available for Australian documents",
        };
    }

    // Validate request body against schema
    const { value, errors } = validateSchema(req.body, schema, {
      allowUnknown: false,
      stripUnknown: false,
      convert: true,
    });

    // Handle any errors
    if (errors)
      throw { status: 400, error: "Unable to validate request", errors };

    // Check cache for previous request
    const {
      rows: [cachedResponse],
      rowCount,
    } = await pool.query(
      `
        select dz.search_date "searchDate", dz.response
        from datazoo_searches dz
        where dz.hash = $1
      `,
      [hashedRequest]
    );

    const [dvsExpiryAmount, dvsExpiryUnit] = process.env
      .DATA_ZOO_DVS_REQUEST_EXPIRY
      ? process.env.DATA_ZOO_DVS_REQUEST_EXPIRY.split(" ")
      : [90, "days"];

    // Use stored response if before request expiry time
    if (
      rowCount &&
      moment(cachedResponse.searchDate)
        .add(dvsExpiryAmount, dvsExpiryUnit)
        .isAfter(moment())
    ) {
      res.json(cachedResponse.response);
      return;
    }
    const config = getVerifyDatasource(value.countryCode);

    // Request verification from dz
    const searchValues = inputMunger(value);
    const { data } = await dz.post(`/verify`, searchValues);
    if (data.messages) {
      throw { status: 500, error: "Dataset unavailable", errors };
    }
    // Store response for reuse
    await pool.query(
      `
        insert into datazoo_searches (hash, body, response)
        values($1,$2,$3)
      `,
      [hashedRequest, req.body, data]
    );

    res.json(data);
  } catch (e) {
    console.log(req);
    console.error(e);
    errorLog(
      req.user.userId,
      JSON.stringify(e),
      JSON.stringify(e.error || "Something went wrong")
    );
    res
      .status(e.status || 500)
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

module.exports = router;
