const router = require("express").Router();
const pool = require("../database/connection");
const validateSchema = require("../utils/validateSchema");
const { matchSchema, confirmSchema } = require("../schema/oracle");
const errorLog = require("../utils/errorLogger");

router.post("/match", async (req, res) => {
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
      mobile,
    } = value;

    const selectPerson = await pool.query(
      `
      WITH matched_person AS (
        SELECT p.id, c.person_id confirmed
        FROM person p left join confirmed_people c on c.person_id = p.id 
        WHERE
          LOWER(p.last_name) = LOWER($1)
          AND p.dob = $2
          AND (LOWER(p.email) = LOWER($3) OR p.mobile = $4)
        )
        SELECT mp.id, mp.confirmed FROM matched_person mp;
      `,
      [lastName, dob, email, mobile]
    );
    // Send response if match found;
    if (selectPerson.rowCount)
      return res.json({
        personId: selectPerson.rows[0].id,
        match: true,
        confirmed: selectPerson.rows[0].confirmed ? true : false,
      });

    // Continue to insert person if no match found
    const insertPerson = await pool.query(
      `
        INSERT INTO person
          (first_name, last_name, dob, street, city, state, postcode, email, mobile) 
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
          id
      `,
      [firstName, lastName, dob, street, city, state, postcode, email, mobile]
    );

    if (!insertPerson.rowCount) throw new Error("Failed to insert new person");

    res.status(201).json({
      personId: insertPerson.rows[0].id,
      match: false,
      confirmed: false,
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
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

router.post("/match/:personId", async (req, res) => {
  try {
    // Validate request
    const { value, errors } = validateSchema(req.params, confirmSchema);

    // Handle any errors
    if (errors) throw { error: "Bad request", errors, status: 400 };

    const {
      rowCount,
    } = await pool.query(
      "INSERT INTO confirmed_people (person_id, user_id) VALUES ($1, $2)",
      [value.personId, req.user.userId]
    );

    if (!rowCount)
      throw {
        error: `Unable to find person with id ${value.personId}`,
        status: 404,
      };

    res.status(204).send();
  } catch (e) {
    errorLog(
      req.user.userId,
      JSON.stringify(e),
      JSON.stringify(e.error || "Something went wrong")
    );
    if (e.constraint === "confirmed_people_person_id_fkey") {
      e.status = 404;
      e.error = `Unable to find person with id ${req.params.personId}`;
    }
    if (e.constraint === "confirmed_people_pkey") {
      e.status = 400;
      e.error = `Person with id ${req.params.personId} has already been confirmed`;
    }
    console.log(e);
    res
      .status(e.status || 500)
      .send({ error: e.error || "Something went wrong", errors: e.errors });
  }
});

module.exports = router;
