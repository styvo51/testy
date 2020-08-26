const getVerifyDatasource = (countryCode) => {
  switch (countryCode) {
    case "AU": {
      return {
        country: "Australia",
        datasources: ["Australian Third Party Datasets"],
      };
    }
    case "NZ": {
      return {
        country: "NewZealand",
        datasources: ["NZTA Drivers License"],
      };
    }
  }
};
module.exports = { getVerifyDatasource };
