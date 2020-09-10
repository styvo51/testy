const express = require("express");
const pool = require("../database/connection");
const errorLog = require("../utils/errorLogger");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.get("/users", async (req, res) => {
  try {
    // Return a given user's api key to make requests with.
    // Keys are kept on the portal server in a cache, never sent to the frontend
    if (!req.query.email) throw { status: 400, error: "Email is required" };
    const { email } = req.query;
    const { rows: user } = await pool.query(
      `
      select api_key from api_keys where user_id = (select id from users where email = $1 order by id limit 1)
    `,
      [email]
    );
    res.status(200).json({ api_key: user[0].api_key });
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

router.post("/users", async (req, res) => {
  // Creates a new user
  try {
    if (!req.body.email || !req.body.company_name)
      throw { status: 400, error: "Email and company name are required" };
    const { email, company_name } = req.body;
    // check to make sure they don't already exist
    const { rows: user } = await pool.query(
      `
      select * from users where email = $1
    `,
      [email]
    );
    if (user.length > 0) throw { status: 400, error: "User already exists" };
    // Add new client
    const apiKey = uuidv4();
    const { rows: userID } = await pool.query(
      `
      insert into users (email, name)
      values($1,$2) returning id
    `,
      [email, company_name]
    );
    await pool.query(
      `
      insert into user_routes (user_id, route)
      values($1,$2)
    `,
      [userID[0].id, "/verify-document*"]
    );
    await pool.query(
      `
      insert into user_routes (user_id, route)
      values($1,$2)
    `,
      [userID[0].id, "/politically-exposed-persons*"]
    );
    await pool.query(
      `
      insert into user_routes (user_id, route)
      values($1,$2)
    `,
      [userID[0].id, "/aml*"]
    );
    await pool.query(
      `
      insert into api_keys (api_key, user_id)
      values($1,$2)
    `,
      [apiKey, userID[0].id]
    );

    res.status(201).json({
      user_created: true,
      apikey: apiKey,
      routes: ["/aml*", "/verify-document*", "/politically-exposed-persons*"],
    });
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

router.get("/users/queries", async (req, res) => {
  try {
    if (!req.query.email || !req.query.startDate || !req.query.endDate) {
      throw { status: 400, error: "Missing email or date range" };
    }
    const { email, startDate, endDate } = req.query;
    const { rows: count } = await pool.query(
      `
      select count(*) as qcount from request_logs rl
      where created between $1 and $2 and user_id = (select id from users where email = $3 order by id limit 1);
    `,
      [startDate, endDate, email]
    );

    res.status(200).json({ count: count[0].qcount });
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
