const app = require("../app");
const request = require("supertest")(app);
const db = require("../../tests/db");
const [, { apikey }] = require("../../tests/mockdata/apiKeys");
const people = require("../../tests/mockdata/people");

let client;
// Run a check that test suite is connecting to test database and seed test data
beforeAll(async () => {
  client = await db.connect();
});

beforeEach(async () => {
  await db.initTables(client);
  await db.seedData(client);
});

afterAll(async () => {
  await client.release();
});

/********************************************
 *                 TESTS
 ********************************************/

describe("POST /oracle/match", () => {
  it("Should not find match where not authenticated", async () => {
    const response = await request
      .post(`/oracle/match`)
      .send(people[1])
      .expect(403);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.match).toBeUndefined();
    expect(response.body.confirmed).toBeUndefined();
    expect(response.body.personId).toBeUndefined();
  });

  it("Finds a match using last name + dob + email + mobile", async () => {
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(people[1])
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1"); // NB bigserial and bigint return string values
  });

  it("Finds a match despite different capitalization", async () => {
    const capitalJohn = { ...people[1] };
    Object.keys(capitalJohn).forEach(
      (key) => (capitalJohn[key] = capitalJohn[key].toUpperCase())
    );
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(capitalJohn)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1"); // NB bigserial and bigint return string values
  });

  it("Finds a match using last name + dob + email but not mobile", async () => {
    const john = { ...people[1] };
    john.mobile = "0499999999"; // changed to different value;
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(john)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1");
  });

  it("Finds a match using last name + dob + mobile but not email", async () => {
    const john = { ...people[1] };
    john.email = "different@email.com"; // changed to different value;
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(john)
      .expect(200);

    expect(response.body.match).toBe(true);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).toBe("1");
  });

  it("Doesn't find a match with no matching properties", async () => {
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(people[Object.keys(people).length])
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Adds a record if no match found and returns the person id", async () => {
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(people[Object.keys(people).length])
      .expect(201);

    const { rows, rowCount } = await client.query(
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
    expect(people[Object.keys(people).length]).toMatchObject(rows[0]);
    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name", async () => {
    const alex = {
      ...people[Object.keys(people).length],
      lastName: people[1].lastName,
    };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob", async () => {
    const alex = { ...people[Object.keys(people).length], dob: people[1].dob };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob and email", async () => {
    const alex = {
      ...people[Object.keys(people).length],
      dob: people[1].dob,
      email: people[1].email,
    };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching dob and mobile", async () => {
    const alex = {
      ...people[Object.keys(people).length],
      dob: people[1].dob,
      mobile: people[1].mobile,
    };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name and email", async () => {
    const alex = {
      ...people[Object.keys(people).length],
      lastName: people[1].lastName,
      email: people[1].email,
    };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Doesn't find a match despite matching last name and mobile", async () => {
    const alex = {
      ...people[Object.keys(people).length],
      lastName: people[1].lastName,
      mobile: people[1].mobile,
    };
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send(alex)
      .expect(201);

    expect(response.body.match).toBe(false);
    expect(response.body.confirmed).toBe(false);
    expect(response.body.personId).not.toBeUndefined();
  });

  it("Handles a bad request from the client", async () => {
    const response = await request
      .post(`/oracle/match?key=${apikey}`)
      .send({ ...people[1], firstName: undefined })
      .expect(400);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.errors.firstName).not.toBeUndefined();
  });
});

describe("POST /oracle/match/:personId", () => {
  it("Should not update record where not authenticated", async () => {
    const response = await request.post(`/oracle/match/1`).send().expect(403);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.match).toBeUndefined();
    expect(response.body.confirmed).toBeUndefined();
    expect(response.body.personId).toBeUndefined();
  });
  it("Updates the person record as confirmed", async () => {
    const response = await request
      .post(`/oracle/match/1?key=${apikey}`)
      .send()
      .expect(204);
    expect(response.body).toMatchObject({});

    const { rowCount } = await client.query(
      "SELECT user_id FROM confirmed_people WHERE user_id = 1"
    );
    expect(rowCount).toBe(0);
  });

  it("Doesn't find the person", async () => {
    const response = await request
      .post(`/oracle/match/999?key=${apikey}`)
      .send()
      .expect(404);

    expect(response.body.error).not.toBeUndefined();
  });

  it("Handles a bad request from the client", async () => {
    const response = await request
      .post(`/oracle/match/badid?key=${apikey}`)
      .send()
      .expect(400);

    expect(response.body.error).not.toBeUndefined();
    expect(response.body.errors.personId).not.toBeUndefined();
  });
});
