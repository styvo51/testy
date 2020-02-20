function auth(req, res, next) {
  try {
    // Verify against .env key
    if (req.query.key == process.env.API_KEY) return next();

    // Throw error if the key isn't valid
    throw {
      error: "Unable to authenticate your api key",
      status: 403
    };
  } catch (e) {
    console.log(e);
    res
      .status(e.status || 400)
      .send({ error: e.error || "Bad request", errorFields: e.errorFields });
  }
}

module.exports = auth;
