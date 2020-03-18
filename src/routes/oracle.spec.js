const fs = require("fs");
const path = require("path");
const pool = require("../database/connection");
const app = require("../app");
const request = require("supertest")(app);

/********************************************
 *               TEST DATA
 ********************************************/

const john = {
  firstName: "John",
  lastName: "Smith",
  dob: "1975-11-23",
  street: "1 Adelaide Street",
  city: "Brisbane",
  state: "QLD",
  postcode: "4000",
  email: "john@email.com",
  mobile: "0411111111"
};

// same last name and dob as John
const jane = {
  firstName: "Jane",
  lastName: "Smith",
  dob: "1975-11-23",
  street: "13 Dawn Street",
  city: "Brisbane",
  state: "QLD",
  postcode: "4001",
  email: "jane@email.com",
  mobile: "0422222222"
};

// Same dob as John
const tim = {
  firstName: "Tim",
  lastName: "Jones",
  dob: "1975-11-23",
  street: "33 Ableton Road",
  city: "Sydney",
  state: "NSW",
  postcode: "2000",
  email: "tim@email.com",
  mobile: "0433333333"
};

// Alex is not seeded in db
const alex = {
  firstName: "Alex",
  lastName: "Hills",
  dob: "1991-06-30",
  street: "14A Mango Road",
  city: "Melbourne",
  state: "VIC",
  postcode: "3000",
  email: "alex@email.com",
  mobile: "0444444444"
};

const API_KEY = "secret";

/********************************************
 *           TEST SUITE LIFECYCLE
 ********************************************/

// Run a check that test suite is connecting to test database and seed test data
beforeAll(async () => {
  process.env = { ...process.env, API_KEY }; // Use test api key
  const { DB_DATABASE, DB_TEST_DATABASE } = process.env;
  const { rows } = await pool.query("SELECT current_database()");
  const dbName = rows[0].current_database;
  expect(dbName).toBe(DB_TEST_DATABASE);
  if (DB_DATABASE && dbName === DB_DATABASE)
    throw new Error("Tests are using wrong database");
});

beforeEach(async () => {
  // Get table creation scripts
  const initTablesSql = fs.readFileSync(
    path.join(
      __dirname,
      "../../oracle-match-sql-scripts/01-match-create-table.sql"
    ),
    "utf8"
  );

  // Extract person table script
  const createPersonTableSql = initTablesSql.replace(
    /^.*(create table person[^;]+;)(.|\n)+$/gi,
    "$1"
  );

  // Funciton to add person
  const insertPerson = async person =>
    await pool.query(
      `
      INSERT INTO person (first_name, last_name, dob, street, city, state, postcode, email, mobile)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      Object.values(person)
    );

  // Reset tables
  await pool.query("DROP SCHEMA public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query(createPersonTableSql);

  // Seed with test data
  await insertPerson(john);
  await insertPerson(jane);
  await insertPerson(tim);
});

afterAll(async () => {
  await pool.end();
});

/********************************************
 *                 TESTS
 ********************************************/

describe("POST /oracle/match", () => {
  it("Should not find match where not authenticated", async () => {
    const response = await request
      .post(`/oracle/match`)
      .send(alex)
      .expect(403);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.match).toBeUndefined();
    expect(response.body.confirmed).toBeUndefined();
    expect(response.body.personId).toBeUndefined();
  });

  it("Finds a match using last name + dob + email + mobile", async () => {
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(john)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1"); // NB bigserial and bigint return string values
  });

  it("Finds a match using last name + dob + email but not mobile", async () => {
    const _john = { ...john };
    _john.mobile = "0499999999"; // changed to different value;
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_john)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1");
  });

  it("Finds a match using last name + dob + mobile but not email", async () => {
    const _john = { ...john };
    _john.email = "different@email.com"; // changed to different value;
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_john)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1");
  });

  it("Doesn't find a match with no matching properties", async () => {
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Adds a record if no match found and returns the person id", async () => {
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(alex)
      .expect(201);

    const { rows, rowCount } = await pool.query(
      `
        SELECT
          first_name "firstName",
          last_name "lastName",
          street,
          city,
          state,
          postcode,
          email,
          mobile
        FROM person
        WHERE id = $1
      `,
      [response.body.personId]
    );

    expect(rowCount).toBe(1);
    expect(alex).toMatchObject(rows[0]);
    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name", async () => {
    const _alex = { ...alex, lastName: john.lastName };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob", async () => {
    const _alex = { ...alex, dob: john.dob };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob and email", async () => {
    const _alex = { ...alex, dob: john.dob, email: john.email };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob and mobile", async () => {
    const _alex = { ...alex, dob: john.dob, mobile: john.mobile };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name and email", async () => {
    const _alex = { ...alex, lastName: john.lastName, email: john.email };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name and mobile", async () => {
    const _alex = { ...alex, lastName: john.lastName, mobile: john.mobile };
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send(_alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Handles a bad request from the client", async () => {
    const response = await request
      .post(`/oracle/match?key=${API_KEY}`)
      .send({ ...john, firstName: undefined })
      .expect(400);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.errors.firstName).not.toBeUndefined();
  });
});

describe("POST /oracle/match/:personId", () => {
  it("Should not update record where not authenticated", async () => {
    const response = await request
      .post(`/oracle/match/1`)
      .send()
      .expect(403);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.match).toBeUndefined();
    expect(response.body.confirmed).toBeUndefined();
    expect(response.body.personId).toBeUndefined();
  });
  it("Updates the person record as confirmed", async () => {
    const response = await request
      .post(`/oracle/match/1?key=${API_KEY}`)
      .send()
      .expect(204);
    expect(response.body).toMatchObject({});

    const { rows } = await pool.query(
      "SELECT confirmed FROM person WHERE id = 1"
    );
    expect(rows[0].confirmed).toBe(true);
  });

  it("Doesn't find the person", async () => {
    const response = await request
      .post(`/oracle/match/999?key=${API_KEY}`)
      .send()
      .expect(404);

    expect(response.body.error).not.toBeUndefined();
  });

  it("Handles a bad request from the client", async () => {
    const response = await request
      .post(`/oracle/match/badid?key=${API_KEY}`)
      .send()
      .expect(400);

    expect(response.body.error).not.toBeUndefined();
    expect(response.body.errors.personId).not.toBeUndefined();
  });
});
