const { Pool } = require("pg");

const { NODE_ENV, DB_TEST_DATABASE, PGDATABASE } = process.env;

const pool = new Pool({
  database: NODE_ENV === "test" ? DB_TEST_DATABASE : PGDATABASE,
});

module.exports = pool;
