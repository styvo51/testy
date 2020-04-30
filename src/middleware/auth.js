const pool = require("../database/connection");
const UrlPattern = require("url-pattern");

const auth = async (req, res, next) => {
  try {
    const {
      rows: [data],
      rowCount,
    } = await pool.query(
      `
        with routes as (
          select user_id, array_agg(route) routes
          from user_routes
          group by user_id
        
        )
        select 
          ak.api_key "apiKey", 
          ak.user_id "userId",
          u.name,
          coalesce (r.routes, array['*']) routes
        from api_keys ak 
          left join routes r on ak.user_id = r.user_id
          join users u on ak.user_id = u.id
        where ak.api_key = $1
    `,
      [req.query.key]
    );

    // Check api key exists
    if (!rowCount)
      throw {
        error: "Unable to authenticate your api key",
        status: 403,
      };

    // Check route is authorized to use route
    const authorizedRoute = data.routes
      .map((route) => new UrlPattern(route))
      .some((pattern) => pattern.match(req.originalUrl)); // returns true if any of the patterns match

    if (!authorizedRoute)
      throw {
        error: "Your account is not authorized to use this endpoint",
        status: 403,
      };
    req.user = { userId: data.userId, name: data.name };
    next();
  } catch (e) {
    console.log(e);
    res.status(e.status || 500).send({ error: e.error || "Server error" });
  }
};

module.exports = auth;
