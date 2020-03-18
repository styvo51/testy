const { Pool } = require("pg");

const {
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
  DB_TEST_DATABASE,
  NODE_ENV
} = process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: NODE_ENV === "test" ? DB_TEST_DATABASE : DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

pool.on("connect", () => {
  //console.log("connected to the db");
});
module.exports = pool;
