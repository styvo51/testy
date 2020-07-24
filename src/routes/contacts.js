const router = require("express").Router();
const pool = require("../database/connection");
// const validateSchema = require("../../utils/validateSchema");
const { ContactSchema } = require("../schema/contacts");
if (process.env.NODE_ENV === "test") {
  var {
    getAccessToken,
    getPropertyId,
    getPropertyData,
  } = require("../apis/domainTestModule");
} else {
  var {
    getAccessToken,
    getPropertyId,
    getPropertyData,
  } = require("../apis/domain");
}
router.post("/", async (req, res, next) => {
  try {
    // Validate request
    // const { value, errors } = validateSchema(req.body, ContactSchema);
    const { error, value } = ContactSchema.validate(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
    // Handle any errors
    if (error) {
      const errorFields = error.details.reduce((map, { context, message }) => {
        map[context.key] = message;
        return map;
      }, {});
      throw { error: "Validation failed", errorFields, status: 400 };
    }

    const { street, city, state, postcode } = value;

    if (state === "TAS" || (postcode >= 7000 && postcode <= 7999)) {
      res.status(200).json({ error: "Tasmania is unavailable for search" });
    }

    // Get domain access token
    const accessToken = await getAccessToken(
      process.env.DOMAIN_ID,
      process.env.DOMAIN_SECRET
    );
    // Get the domain property id for the requested property
    const propertyId = await getPropertyId(
      accessToken,
      street,
      city,
      postcode,
      state
    );
    if (!propertyId) {
      res.status(500).json({
        error:
          "An error has occured. If this problem persists, please contact support.",
      });
      return;
    }
    const domainData = await getPropertyData(accessToken, propertyId);

    const results = {
      owner_occupied: false,
    };
    if (domainData.owners.ownerOccupied) {
      results.owner_occupied = true;
    }
    if (domainData.owners) {
      results.owner_contacts = { owner_name: {} };
      if (domainData.owners.ownerAddress.length > 3) {
        results.owner_contacts.raw_addresses = [domainData.owners.ownerAddress];
      }

      results.owner_contacts.owner_name.raw_name_record =
        domainData.owners.names;
    }

    // If domain says it's owner/occupier, then we query for more contact details from the imx db.
    if (results.owner_occupied) {
      // Search imx db based on the address provided (the technical term for search by name in this instance is 'a dumpster fire')
      const selectPerson = await pool.query(
        `
        select * from person p where upper(street) like $1 and upper(city) like $2 and upper(state) like $3 and postcode like $4 
        `,
        [street, city, state, postcode]
      );
      if (selectPerson.rows.length > 0) {
        const person = selectPerson.rows[0];
        results.owner_contacts.owner_name.first_name = person.first_name;
        results.owner_contacts.owner_name.last_name = person.last_name;
        results.owner_contacts.email = person.email;
        results.owner_contacts.phone = person.mobile;
        results.owner_contacts.address = {
          street: person.street,
          city: person.city,
          postcode: person.postcode,
          state: person.state,
        };
      }
    } else if (domainData.owners.ownerAddress.length > 3) {
      // Do black magic with the domain address to confirm and search
      if (state === "NSW") {
        // NSW address: 53 WISDOM ST, GUILDFORD WEST, NSW, 2161
        const domainAddress = domainData.owners.ownerAddress.split(",");
        const query = await pool.query(
          `
          select * from person p where upper(street) like $1 and upper(city) like $2 and upper(state) like $3 and postcode like $4 
          `,
          [
            domainAddress[0].toUpperCase().trim(),
            domainAddress[1].toUpperCase().trim(),
            domainAddress[2].toUpperCase().trim(),
            domainAddress[3].trim(),
          ]
        );
        if (query.rows.length > 0) {
          const person = query.rows[0];
          results.owner_contacts.owner_name.first_name = person.first_name;
          results.owner_contacts.owner_name.last_name = person.last_name;
          results.owner_contacts.email = person.email;
          results.owner_contacts.phone = person.mobile;
          results.owner_contacts.address = {
            street: person.street,
            city: person.city,
            postcode: person.postcode,
            state: person.state,
          };
        }
      } else if (state === "QLD") {
        // QLD address: 169 BRIDGEMAN RD, BRIDGEMAN DOWNS QLD 4035
        const dPostcode = domainData.owners.ownerAddress.slice(
          domainData.owners.ownerAddress.length - 4
        );
        const dStreet = domainData.owners.ownerAddress
          .split(",")[0]
          .trim()
          .toUpperCase();
        const cityEtc = domainData.owners.ownerAddress.split(",")[1];
        const dCity = cityEtc
          .slice(0, cityEtc.length - 8)
          .trim()
          .toUpperCase();

        const query = await pool.query(
          `
          select * from person p where upper(street) like $1 and upper(city) like $2 and upper(state) like $3 and postcode like $4 
          `,
          [dStreet, dCity, "QLD", dPostcode]
        );

        if (query.rows.length > 0) {
          const person = query.rows[0];
          results.owner_contacts.owner_name.first_name = person.first_name;
          results.owner_contacts.owner_name.last_name = person.last_name;
          results.owner_contacts.email = person.email;
          results.owner_contacts.phone = person.mobile;
          results.owner_contacts.address = {
            street: person.street,
            city: person.city,
            postcode: person.postcode,
            state: person.state,
          };
        }
      }
    }
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res
      .status(e.status || 400)
      .send({ error: e.error || "Bad request", errorFields: e.errorFields });
  }
});

module.exports = router;
