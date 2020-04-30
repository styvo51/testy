const express = require("express");
const moment = require("moment");
const hash = require("object-hash");
const dz = require("../apis/datazoo");
const pool = require("../database/connection");
const validateSchema = require("../utils/validateSchema");
const {
  DriversLicenceVerificationSchema,
  PassportVerificationSchema,
  MedicareCardVerificationSchema,
} = require("../schema/verifyDocument");
const router = express.Router();

router.post("/:document", async (req, res) => {
  try {
    if (!req.params.document.match(/^(driverslicence|passport|medicarecard)$/))
      throw { status: 404, error: "Not a valid endpoint" };

    const hashedRequest = hash(req.body);
    let schema;

    switch (req.params.document) {
      case "driverslicence":
        schema = DriversLicenceVerificationSchema;
        break;
      case "passport":
        schema = PassportVerificationSchema;
        break;
      case "medicarecard":
        schema = MedicareCardVerificationSchema;
        break;
      default:
      // no default
    }

    // Validate request body against schema
    const { value, errors } = validateSchema(req.body, schema, {
      allowUnknown: false,
      stripUnknown: false,
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
      return res.send(cachedResponse.response);
    }

    // Request verification from dz
    const { data } = await dz.post("/Australia/Verify.json", {
      ...value,
      dataSources: ["Australian Third Party Datasets"],
    });
    // Store response for reuse
    await pool.query(
      `
        insert into datazoo_searches (hash, body, response)
        values($1,$2,$3)
      `,
      [hashedRequest, req.body, data]
    );

    // try {
    //   // await pool.query;
    //   if (data.thirdPartyDatasets.verified) {
    //   }
    // } catch (e) {
    //   console.log(e);
    // }

    res.json(data);
  } catch (e) {
    console.error(e);
    res
      .status(e.status || 500)
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

module.exports = router;
