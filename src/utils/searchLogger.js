const pool = require("../database/connection");

const searchLog = async (
  user_id,
  type,
  created = new Date().toISOString(),
  body,
  response
) => {
  try {
    // Save the search record in the searches table
    // Sanitize the body
    if (body.passportNo) {
      body.passportNo = "************";
    } else if (body.driversLicenceNo) {
      body.driversLicenceNo = "************";
      if (body.driversLicenceState) {
        body.driversLicenceState = "***";
      } else {
        body.driversLicenseVersion = "*";
      }
    } else if (body.medicareCardNo) {
      body.medicareCardNo = "************";
      body.medicareCardType = "*";
      body.medicareIndividualRefNo = "*";
      body.medicareExpiryDate = "****-**";
    }
    // const sanitizedResponse = {
    //   reportingReference: response.reportingReference,
    // };
    // if ("thirdPartyDatasets" in response) {
    //   sanitizedResponse.thirdPartyDatasets.verified =
    //     response.thirdPartyDatasets.verified || false;
    //   sanitizedResponse.thirdPartyDatasets.status =
    //     response.thirdPartyDatasets.status;
    //   if (response.thirdPartyDatasets.errorMessage) {
    //     sanitizedResponse.thirdPartyDatasets.errorMessage =
    //       response.thirdPartyDatasets.errorMessage;
    //   }
    // }
    // if ("driversLicence" in response) {
    //   sanitizedResponse.driversLicence.verified =
    //     response.driversLicence.verified;
    //   sanitizedResponse.driversLicence.status = response.driversLicence.status;
    //   if (response.driversLicence.errorMessage) {
    //     sanitizedResponse.driversLicence.errorMessage =
    //       response.driversLicence.errorMessage;
    //   }
    // }
    // if ("watchlistAML" in response) {
    //   sanitizedResponse.verified = response.watchlistAML[0].verified;
    //   sanitizedResponse.urlMore =
    //     response.watchlistAML[0].watchlistAMLAdditionalInfo.urlMore;
    //   sanitizedResponse.category =
    //     response.watchlistAML[0].watchlistAMLAdditionalInfo.category;
    // }
    console.log(body, response);
    await pool.query(
      `
        insert into searches (user_id, search_type, created, body, response)
        values($1, $2, $3, $4, $5)
      `,
      [user_id, type, created, body, response]
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = searchLog;
