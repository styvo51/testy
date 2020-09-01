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
// Input reformatters
const reformatAMLInput = (data) => {
  return {
    countryCode: "All",
    service: ["Watchlist AML"],
    ...data,
  };
};
const reformatDriversLicenseInput = (countryCode, data) => {
  // Reformat for AU, NZ

  switch (countryCode) {
    case "AU": {
      const base = {
        countryCode,
        service: ["Australia Driver Licence"],
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        identityVariables: {
          driversLicenceNo: data.driversLicenceNo,
          driversLicenceStateOfIssue: data.driversLicenceState,
        },
        consentObtained: {
          "Australia Driver Licence": data.thirdPartyDatasetsConsentObtained,
        },
      };
      if (data.middleName) {
        base.middleName = data.middleName;
      }
      return base;
    }
    case "NZ": {
      const base = {
        countryCode: "NZ",
        service: ["New Zealand Driver Licence"],
        firstName: data.firstName,
        middleName: null,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        identityVariables: {
          driversLicenceNo: data.driversLicenceNo,
          driversLicenceVersion: data.driversLicenceVersion,
        },
        consentObtained: {
          "New Zealand Driver Licence": data.driversLicenceConsentObtained,
        },
      };
      if (data.middleName) {
        base.middleName = data.middleName;
      }
      return base;
    }
    default: {
      throw {
        status: 400,
        error:
          "Currently 4MDB only supports Australia and NZ driver's license verification",
      };
    }
  }
};
const reformatMedicareInput = (data) => {
  const base = {
    countryCode: "AU",
    service: ["Australia Medicare Card"],
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    identityVariables: {
      medicareCardType: data.medicareCardType,
      medicareExpiry: data.medicareExpiry,
      medicareCardNo: data.medicareCardNo,
      medicareReferenceNo: data.medicareIndividualRefNo,
    },
    consentObtained: {
      "Australia Medicare Card": data.thirdPartyDatasetsConsentObtained,
    },
  };
  if (data.middleName) {
    base.middleName = data.middleName;
  }
  return base;
};
const reformatPassportInput = (countryCode, data) => {
  // Reformat for AU, NZ
  switch (countryCode) {
    case "AU": {
      const base = {
        countryCode: "AU",
        service: ["Australia Passport"],
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        identityVariables: {
          passportNo: data.passportNo,
          passportExpiry: data.passportExpiry,
        },

        consentObtained: {
          "Australia Passport": data.thirdPartyDatasetsConsentObtained,
        },
      };
      if (data.middleName) {
        base.middleName = data.middleName;
      }
      return base;
    }
    case "NZ": {
      const base = {
        countryCode: "NZ",
        service: ["New Zealand DIA Passport"],
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        identityVariables: {
          passportNo: data.passportNo,
          passportExpiry: data.passportExpiry,
        },
        consentObtained: {
          "New Zealand DIA Passport": data.thirdPartyDatasetsConsentObtained,
        },
      };
      if (data.middleName) {
        base.middleName = data.middleName;
      }
      return base;
    }
    default: {
      throw {
        status: 400,
        error:
          "Currently 4MDB only supports Australia and New Zealand passport verification",
      };
    }
  }
};

// Output reformatters
const reformatMedicareOutput = (req, res) => {
  return {
    reportingReference: res.reportingReference,
    safeHarbour: res.safeHarbour,
    thirdPartyDatasets: {
      status:
        res.serviceResponses["Australia Government Identity Documents 3"]
          .status,
      verified:
        res.serviceResponses["Australia Government Identity Documents 3"]
          .identityVerified,
      safeHarbourScore:
        res.res.serviceResponses["Australia Government Identity Documents 3"],
      firstName: req.firstName,
      middleName: req.middleName ? req.middleName : null,
      lastName: req.lastName,
      dateOfBirth: req.dateOfBirth,
      medicareCardNo: req.medicareCardNo,
      medicareCardType: req.medicareCardType,
      medicareIndividualRefNo: req.medicareIndividualRefNo,
      medicareExpiryDate: req.medicareExpiryDate,
    },
  };
};
const reformatDriversLicenseOutput = (req, res) => {
  switch (req.countryCode) {
    case "AU": {
      return {
        countryCode: "AU",
        reportingReference: res.reportingReference,
        safeHarbour: res.safeHarbour,
        thirdPartyDatasets: {
          status:
            res.serviceResponses["Australia Government Identity Documents 1"]
              .status,
          verified:
            res.serviceResponses["Australia Government Identity Documents 1"]
              .identityVerified,
          safeHarbourScore:
            res.res.serviceResponses[
              "Australia Government Identity Documents 1"
            ],
          firstName: req.firstName,
          middleName: req.middleName ? req.middleName : null,
          lastName: req.lastName,
          dateOfBirth: req.dateOfBirth,
          driversLicenceNo: req.driversLicenceNo,
          driversLicenceState: req.driversLicenceState,
        },
      };
    }
    case "NZ": {
      return {
        countryCode: "NZ",
        reportingReference: res.reportingReference,
        safeHarbour: res.safeHarbour,
        driversLicense: {
          status: res.serviceResponses["New Zealand Driver Licence"].status,
          verified:
            res.serviceResponses["New Zealand Driver Licence"].identityVerified,
          safeHarbourScore:
            res.res.serviceResponses["New Zealand Driver Licence"],
          firstName: req.firstName,
          middleName: req.middleName ? req.middleName : null,
          lastName: req.lastName,
          dateOfBirth: req.dateOfBirth,
        },
      };
    }
  }
};
const reformatPassportOutput = (req, res) => {
  return {
    countryCode: "NZ",
    reportingReference: res.reportingReference,
    safeHarbour: res.safeHarbour,
    thirdPartyDatasets: {
      status:
        res.serviceResponses["Australia Government Identity Documents 2"]
          .status,
      verified:
        res.serviceResponses["Australia Government Identity Documents 2"]
          .identityVerified,
      safeHarbourScore:
        res.res.serviceResponses["Australia Government Identity Documents 2"],
      firstName: req.firstName,
      lastName: req.lastName,
      dateOfBirth: req.dateOfBirth,
      passportNo: req.passportNo,
    },
  };
};

module.exports = {
  getVerifyDatasource,
  reformatAMLInput,
  reformatDriversLicenseInput,
  reformatMedicareInput,
  reformatPassportInput,
  reformatMedicareOutput,
  reformatDriversLicenseOutput,
  reformatPassportOutput,
};
