const router = require("express").Router();
const pool = require("../database/connection");
const validateSchema = require("../utils/validateSchema");
const auth = require("../middleware/auth");
const { matchSchema, confirmSchema } = require("../schema/oracle");

router.post("/match", auth, async (req, res) => {
  try {
    // Validate request
    const { value, errors } = validateSchema(req.body, matchSchema);

    // Handle any errors
    if (errors) throw { error: "Bad request", errors, status: 400 };

    const {
      firstName,
      lastName,
      dob,
      street,
      city,
      state,
      postcode,
      email,
      mobile
    } = value;

    const selectPerson = await pool.query(
      `
        SELECT p.id "personId", p.confirmed
        FROM person p
        WHERE
          LOWER(p.last_name) = LOWER($1)
          AND p.dob = $2
          AND (LOWER(p.email) = LOWER($3) OR p.mobile = $4)

      `,
      [lastName, dob, email, mobile]
    );

    // Send response if match found;
    if (selectPerson.rowCount)
      return res.json({
        personId: selectPerson.rows[0].personId,
        match: true,
        confirmed: selectPerson.rows[0].confirmed
      });

    // Continue to insert person if no match found
    const insertPerson = await pool.query(
      `
        INSERT INTO person
          (first_name, last_name, dob, street, city, state, postcode, email, mobile) 
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
          id, confirmed

      `,
      [firstName, lastName, dob, street, city, state, postcode, email, mobile]
    );

    if (!insertPerson.rowCount) throw new Error("Failed to insert new person");

    res.status(201).json({
      personId: insertPerson.rows[0].id,
      match: false,
      confirmed: false
    });
  } catch (e) {
    console.log(e);
    res
      .status(e.status || 500)
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

router.post("/match/:personId", auth, async (req, res) => {
  try {
    // Validate request
    const { value, errors } = validateSchema(req.params, confirmSchema);

    // Handle any errors
    if (errors) throw { error: "Bad request", errors, status: 400 };

    const {
      rows,
      rowCount
    } = await pool.query(
      "UPDATE person p SET confirmed = true WHERE p.id = $1",
      [value.personId]
    );

    if (!rowCount)
      throw {
        error: `Unable to find person with id ${value.personId}`,
        status: 404
      };

    res.status(204).send();
  } catch (e) {
    console.log(e);
    res
      .status(e.status || 500)
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

module.exports = router;
