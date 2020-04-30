// Place after auth middelware
const whitelistByUsers = (names) => (req, res, next) => {
  if (names.some((name) => name === req.user.name)) return next();
  return res.status(403).send({ error: "Invalid or unauthorized api key" });
};

module.exports = whitelistByUsers;
