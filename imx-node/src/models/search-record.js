const db = require("../database/connection");
async function setSearchRecord(
  apiKey,
  lastName,
  address1,
  address2,
  postcode,
  state,
  match,
  corporate
) {
  try {
    await db.query(
      `
          insert into confirm_records (api_key, last_name, address1, address2, postcode, state, match, corporate)
          values ($1,$2,$3,$4,$5,$6,$7,$8)
          `,
      [apiKey, lastName, address1, address2, postcode, state, match, corporate]
    );
  } catch (error) {
    console.log(error);
  }
}
async function getSearchCount(key, startDate, endDate) {
  try {
    const { rows } = await db.query(
      `select count(api_key) as used_hits
      from confirm_records as cr 
      where api_key=$1 and search_time > $2 and search_time < $3 
        `,
      [key, startDate, endDate]
    );
    return rows[0].used_hits;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { setSearchRecord, getSearchCount };
