const { getSearchCount } = require("../models/search-record");
const startOfMonth = require("date-fns/startOfMonth");
const endOfMonth = require("date-fns/endOfMonth");
async function ratelimit(req, res, next) {
  try {
    const month = new Date();
    const count = await getSearchCount(
      String(process.env.API_KEY),
      startOfMonth(month),
      endOfMonth(month)
    );
    if (count <= Number(process.env.RATE_LIMIT)) {
      return next();
    }
    throw {
      error: "Monthly rate limit exceeded",
      status: 429
    };
  } catch (e) {
    console.log(e);
    res
      .status(e.status || 400)
      .send({ error: e.error || "Bad request", errorFields: e.errorFields });
  }
}

module.exports = ratelimit;
