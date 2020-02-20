const express = require("express");
const router = express.Router();
const ConfirmSchema = require("../schema/confirm");
const auth = require("../middleware/auth");
const ratelimit = require("../middleware/ratelimit");
const {
  getAccessToken,
  getPropertyId,
  getDomainMatch
} = require("../apis/domain");
const { setSearchRecord } = require("../models/search-record");

router.post("/", auth, ratelimit, async (req, res, next) => {
  try {
    // validate request
    const { error, value } = ConfirmSchema.validate(req.body, {
      allowUnknown: true,
      abortEarly: false
    });
    // handle any errors
    if (error) {
      const errorFields = error.details.reduce((map, { context, message }) => {
        map[context.key] = message;
        return map;
      }, {});
      throw { error: "Validation failed", errorFields, status: 400 };
    }
    // access body data with value.firstName, etc
    // Get Domain access token
    const accessToken = await getAccessToken(
      process.env.DOMAIN_ID,
      process.env.DOMAIN_SECRET
    );
    // const propertyId = 555;
    // const accessToken = "ec2e8f74e034a6832e83d5a177ecba1";
    const propertyId = await getPropertyId(
      accessToken,
      value.address1,
      value.address2,
      value.postcode,
      value.state
    );
    if (!propertyId) {
      res.status(500).json({
        error:
          "An error has occured. If this problem persists, please contact support."
      });
      return;
    }
    // Get Domain T/F name match (/names/property)
    const domainMatch = await getDomainMatch(
      accessToken,
      value.lastName,
      propertyId,
      value.state,
      value.postcode,
      value.firstName,
      value.nicknames
    );
    if (domainMatch.error) {
      res.status(200).json(domainMatch);
      return;
    }
    // Save search record
    await setSearchRecord(
      String(process.env.API_KEY),
      req.ip,
      value.firstName,
      value.lastName,
      value.address1,
      value.address2,
      value.postcode,
      value.state,
      domainMatch.match,
      value.nicknames.join(",")
    );

    res.status(200).json(domainMatch);
  } catch (e) {
    console.log(e);
    res
      .status(e.status || 400)
      .send({ error: e.error || "Bad request", errorFields: e.errorFields });
  }
});

module.exports = router;
