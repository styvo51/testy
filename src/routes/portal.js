const express = require("express");
const pool = require("../database/connection");
const errorLog = require("../utils/errorLogger");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Return a given user's api key to make requests with.
    // Keys are kept on the portal server in a cache, never sent to the frontend
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
