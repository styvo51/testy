const express = require("express");
const moment = require("moment");
const hash = require("object-hash");
const dz = require("../apis/datazoo-idu");
const pool = require("../database/connection");
const validateSchema = require("../utils/validateSchema");
const { PepsSchema } = require("../schema/politicallyExposedPersons");
const { reformatAMLInput } = require("../apis/datazooHelpers");
const router = express.Router();
const errorLog = require("../utils/errorLogger");

router.post("/watchlist", async (req, res) => {
  try {
    // Validate request body against schema
    const { value, errors } = validateSchema(req.body, PepsSchema, {
      allowUnknown: false,
      stripUnknown: false,
    });

    // Handle any errors
    if (errors)
      throw { status: 400, error: "Unable to validate request", errors };
    const hashedRequest = hash(req.body);
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

    const [pepsExpiryAmount, pepsExpiryUnit] = process.env
      .DATA_ZOO_PEPS_REQUEST_EXPIRY
      ? process.env.DATA_ZOO_PEPS_REQUEST_EXPIRY.split(" ")
      : [90, "days"];

    // Use stored response if before request expiry time
    if (
      rowCount &&
      moment(cachedResponse.searchDate)
        .add(pepsExpiryAmount, pepsExpiryUnit)
        .isAfter(moment())
    )
      return res.send(cachedResponse.response);

    // Request verification from dz
    const newReqData = reformatAMLInput(value);
    const { data } = await dz.post("/verify", newReqData);

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
