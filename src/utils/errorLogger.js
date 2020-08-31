const pool = require("../database/connection");

const errorLog = async (user_id, internal_error, client_error) => {
  try {
    // Save the error record in the error_logs table
    await pool.query(
      `
        insert into error_logs (user_id, internal_error, client_error)
        values($1, $2, $3)
      `,
      [user_id, internal_error, client_error]
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = errorLog;
