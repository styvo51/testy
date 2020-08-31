var express = require("express");
var router = express.Router();
const match = require("../models/match");
const utils = require("../middleware/matchUtils");
const Fuse = require("fuse.js");
const auth = require("../middleware/auth");
const errorLog = require("../utils/errorLogger");
const domainAPICall = false; //require("../domainCall");

/* POST match
 *  Returns 200 for success, or 404 if the person cannot be found
 *  Checks domain before returning false.
 */
router.post("/", auth, async (req, res, next) => {
  try {
    const { body } = req;
    // Call Domain api here
    // Call Imx db
    // -- Get list of Persons
    let possibles = await match.getPerson(body.dob, body.email, body.mobile);
    // Fuzzy search list, select highest scoring result
    let fuse = new Fuse(possibles, {
      keys: ["first_name", "last_name"],
      includeScore: true,
      shouldSort: true,
      threshold: 0.25,
    });
    const fuzzySearch = fuse.search(body.first_name, body.last_name);
    let imxPerson;
    if (fuzzySearch.length > 0) {
      imxPerson = fuzzySearch[0].item;
      imxPerson.score = fuzzySearch[0].score;
    }
    // -- If not found, create new record, update imxPerson with person_id
    if (!imxPerson && domainAPICall) {
      imxPerson = { score: 0 };
      imxPerson.person_id = await match.setPerson(
        body.first_name,
        body.last_name,
        body.dob,
        body.email,
        body.mobile
      );
    } else if (!imxPerson && !domainAPICall) {
      // Neither Imx or Domain have a record for this person
      res.status(404).json({ match: false, confidence: 1 });
      return;
    }

    let imxAddress = await match.getAddress(imxPerson.person_id);
    let imxBank = await match.getBank(imxPerson.person_id);
    let imxContact = await match.getContact(imxPerson.person_id);

    // Compare Domain and IMX, update if needed'
    // -- Only check for differences if Domain has a record of that person
    if (domainAPICall) {
      // -- Get new records
      const addressRecord = utils.generateNewRecord(
        ["address1", "address2", "postcode", "state", "purchase_price"],
        imxAddress,
        domainAPICall
      );
      const bankRecord = utils.generateNewRecord(
        ["bank_name", "user_name"],
        imxBank,
        domainAPICall
      );
      const contactRecord = utils.generateNewRecord(
        ["landline", "url", "ip", "title"],
        imxContact,
        domainAPICall
      );
      // -- Update as needed, update in-memory imx data
      if (addressRecord) {
        // create new address record
        await match.setAddress(
          imxPerson.person_id,
          addressRecord.address1,
          addressRecord.address2,
          addressRecord.postcode,
          addressRecord.state,
          addressRecord.purchase_price
        );
        imxAddress = { ...addressRecord };
      }
      if (bankRecord) {
        // create new bank record
        await match.setBank(
          imxPerson.person_id,
          bankRecord.bank_name,
          bankRecord.user_name
        );
        imxBank = { ...bankRecord };
      }
      if (contactRecord) {
        // create new contact record
        await match.setContact(
          imxPerson.person_id,
          contactRecord.landline,
          contactRecord.url,
          contactRecord.ip,
          contactRecord.title
        );
        imxContact = { ...contactRecord };
      }
    }

    // Compare new Imx record and body
    // -- Get diffs
    const addressDiff = await utils.compareRecords(
      ["address1", "address2", "postcode", "state", "purchase_price"],
      imxAddress,
      body
    );
    const bankDiff = await utils.compareRecords(
      ["bank_name", "user_name"],
      imxBank,
      body
    );
    const contactDiff = await utils.compareRecords(
      ["landline", "url", "ip", "title"],
      imxContact,
      body
    );
    // -- Compare results
    const compareResult =
      addressDiff.length > 0 || bankDiff.length > 0 || contactDiff.length > 0
        ? false
        : true;

    // Add search record
    await match.setSearchRecord(imxPerson.person_id);

    // Return comparision results
    // Confidence needs calculation as the fuse threshold counts down rather than up for confidence
    res
      .status(200)
      .type("json")
      .json({
        match: compareResult,
        confidence: (1 - imxPerson.score).toFixed(2),
        person: imxPerson,
      });
  } catch (e) {
    console.log(e);
    errorLog(
      req.user.userId,
      JSON.stringify(e),
      JSON.stringify(e.error || "Something went wrong")
    );
    res
      .status(e.status || 500)
      .json({ error: e.error || "Something went wrong" });
  }
});

module.exports = router;
