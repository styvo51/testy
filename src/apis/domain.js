const axios = require("axios");
const querystring = require("querystring");
const cache = require("../cache");
const { matchSingleName, processNameData } = require("./domainHelpers");
/**
 * Get access token using client credential auth flow
 * @param {string} clientId Your client's Id
 * @param {string} secret Your client's secret
 */
async function getAccessToken(clientId, secret) {
  try {
    const cachedToken = cache.get("domainToken");
    if (cachedToken == undefined) {
      const data = querystring.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: secret
      });
      const accessToken = await axios.post(
        "https://api.pricefinder.com.au/v1/oauth2/token",
        data,
        {
          headers: {
            Authorization: `Basic ${clientId}:${secret}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      cache.set(
        "domainToken",
        accessToken.data.access_token,
        accessToken.data.expires_in
      );
      return accessToken.data.access_token;
    }
    return cachedToken;
  } catch (err) {
    console.error(err.response.data);
  }
}

function base64(str) {
  return Buffer.from(str).toString("base64");
}

async function getPropertyId(accessToken, address1, address2, postcode, state) {
  try {
    const data = querystring.stringify({
      q: `${address1} ${address2} ${state} ${postcode}`
    });
    const req = await axios.get(
      `https://api.pricefinder.com.au/v1/suggest/properties?${data}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const propertyData = await req.data;
    return await propertyData.matches[0].property.id;
  } catch (err) {
    console.log(err.response.data);
    console.log(err.response);
  }
}

async function getDomainMatch(accessToken, lastName, propertyId) {
  try {
    const domain = await axios.get(
      `https://api.pricefinder.com.au/v1/properties/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const owner = await domain.data;
    // const owner = DomainData;

    if (owner.owners.names) {
      // Extract name data
      const { ownerNames, corporate } = processNameData(
        lastName,
        owner.owners.names
      );
      // Check surname
      const surnameMatch = matchSingleName(lastName, ownerNames);
      // Return true if a surname match was found
      if (surnameMatch) {
        return result(true, false, ownerNames, lastName);
      }
      // Return if corporate owner
      if (corporate) {
        return result(false, true, ownerNames, lastName);
      }
    }
    return result(false, false, "", lastName);
  } catch (err) {
    console.log(err);
    return result(false, false, "", lastName);
  }
}

const result = (match, corporate, owner, surname) => {
  return {
    match,
    corporate,
    owner,
    tried: {
      surname
    },
    matchedOn: {
      surname: match ? surname : ""
    }
  };
};

module.exports = { getAccessToken, getPropertyId, getDomainMatch };
