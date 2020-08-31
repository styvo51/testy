const path = require("path");
const fs = require("fs");
const pool = require("../src/database/connection");
const users = require("./mockdata/users");
const people = require("./mockdata/people");
const apiKeys = require("./mockdata/apiKeys");

// Verify using test database
const connect = async () => {
  const client = await pool.connect();
  const { rows } = await pool.query("SELECT current_database()");
  const dbName = rows[0].current_database;
  if (
    dbName !== process.env.DB_TEST_DATABASE ||
    (process.env.DB_DATABASE && dbName === process.env.PGDATABASE)
  ) {
    await client.release();
    throw new Error("Tests are using wrong database");
  }

  return client;
};
// Init tables based on db-scripts
const initTables = async (client) => {
  await client.query("DROP  SCHEMA IF EXISTS public CASCADE");
  await client.query("CREATE SCHEMA public");
  const tableScripts = fs
    .readFileSync(
      path.resolve(__dirname, "../db-scripts/01-tables.sql"),
      "utf8"
    )
    .toString()
    .split(";");

  await Promise.all(tableScripts.map(async (sql) => await client.query(sql)));
  const logScripts = fs
    .readFileSync(
      path.resolve(__dirname, "../db-scripts/03-request-logs.sql"),
      "utf8"
    )
    .toString()
    .split(";");

  await Promise.all(logScripts.map(async (sql) => await client.query(sql)));
  const errorScripts = fs
    .readFileSync(
      path.resolve(__dirname, "../db-scripts/04-error-logs.sql"),
      "utf8"
    )
    .toString()
    .split(";");

  await Promise.all(errorScripts.map(async (sql) => await client.query(sql)));
};

const seedPeople = async (client) =>
  await Promise.all(
    Object.values(people)
      .slice(0, -1) // dont seed last user
      .map(
        async (person) =>
          await client.query(
            `
            INSERT INTO person (first_name, last_name, dob, street, city, state, postcode, email, mobile)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
            Object.values(person)
          )
      )
  );

const seedUsers = async (client) =>
  await Promise.all(
    Object.values(users).map(
      async ({ name }) =>
        await client.query("INSERT INTO users (name) VALUES ($1)", [name])
    )
  );

const seedApiKeys = async (client) =>
  await Promise.all(
    apiKeys.map(
      async ({ userId, apikey }) =>
        await client.query(
          "insert into api_keys (user_id, api_key) values ($1, $2)",
          [userId, apikey]
        )
    )
  );

const seedData = async (client) => {
  await seedPeople(client);
  await seedUsers(client);
  await seedApiKeys(client);
};

module.exports = {
  connect,
  initTables,
  seedPeople,
  seedUsers,
  seedApiKeys,
  seedData,
};
