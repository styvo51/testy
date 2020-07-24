const { v4: uuidv4 } = require("uuid");
const addresses = require("../../tests/mockdata/domainMockData");

async function getAccessToken(clientId, secret) {
  return uuidv4();
}
async function getPropertyId(accessToken, street, city, postcode, state) {
  switch (postcode) {
    case 4000: {
      return addresses.qld.id;
    }
    case 2000: {
      return addresses.nsw.id;
    }
    case 4001: {
      return addresses.ownerOccupied.id;
    }
    case 3000: {
      return addresses.noRecords.id;
    }
    default: {
      return addresses.noRecords.id;
    }
  }
}
async function getPropertyData(accessToken, propertyID) {
  return {
    id: addresses[propertyID].id,
    owners: {
      names: addresses[propertyID].names,
      ownerAddress: addresses[propertyID].ownerAddress,
      ownerOccupied: addresses[propertyID].ownerOccupied,
    },
  };
}

module.exports = { getAccessToken, getPropertyId, getPropertyData };
