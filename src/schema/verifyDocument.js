const joi = require("@hapi/joi");
const moment = require("moment");

const common = joi.object({
  countryCode: joi.string().length(2).uppercase().valid("AU", "NZ").required(),
  firstName: joi.string().trim().required(),
  middleName: joi.string().trim().optional().allow(null),
  lastName: joi.string().trim().required(),
  dateOfBirth: joi
    .string()
    .pattern(/^\d{4}-[01]\d-[0123]\d$/, "YYYY-MM-DD")
    .required(),
});

const NZDriversLicenceVerificationSchema = common.concat(
  joi.object({
    driversLicenceNo: joi.string().required(),
    driversLicenceVersion: joi.string().required(),
    driversLicenceConsentObtained: joi.boolean().required().valid(true),
  })
);

const AUDriversLicenceVerificationSchema = common.concat(
  joi.object({
    driversLicenceNo: joi.string().required(),
    driversLicenceState: joi
      .string()
      .pattern(/^(QLD|NSW|ACT|VIC|TAS|SA|WA|NT)$/)
      .message('"state" must be QLD, NSW, ACT, VIC, TAS, SA, WA or NT')
      .uppercase(),
    thirdPartyDatasetsConsentObtained: joi.boolean().required().valid(true),
  })
);

const PassportVerificationSchema = common.concat(
  joi.object({
    thirdPartyDatasetsConsentObtained: joi.boolean().required().valid(true),
    passportExpiry: joi
      .string()
      .pattern(/^\d{4}-[01]\d-[0123]\d$/, "YYYY-MM-DD")
      .required(),
    passportNo: joi.string().min(8).max(9).required(),
    gender: joi
      .string()
      .pattern(/^(Male|Female|X)$/)
      .message('"gender" must be Male, Female, or X')
      .required(),
  })
);

const MedicareCardVerificationSchema = common.concat(
  joi.object({
    thirdPartyDatasetsConsentObtained: joi.boolean().required().valid(true),
    medicareCardNo: joi.string().required(),
    medicareCardType: joi
      .string()
      .required()
      .pattern(/^(G|B|Y)$/)
      .message(
        '"medicareCardType" must be G, B, or Y, corresponding to the type of card, where G means normal, B means interim, and Y means reciprocal health care agreement visitors'
      ),
    medicareIndividualRefNo: joi
      .string()
      .required()
      .pattern(/^\d+$/)
      .message('"medicareIndividualRefNo" must be a string of integers'),
    medicareExpiryDate: joi
      .string()
      .required()
      .pattern(/^\d{4}-[01][012]$/, "YYYY-MM") // mandatory input YYYY-MM.
      .custom((v) => {
        const now = moment();
        const exp = moment(v).add(1, "month").subtract(1, "second");
        if (now.isAfter(exp)) throw new Error();
        return v;
      })
      .message('"medicareExpiryDate" has expired'),
  })
);
module.exports = {
  NZDriversLicenceVerificationSchema,
  AUDriversLicenceVerificationSchema,
  PassportVerificationSchema,
  MedicareCardVerificationSchema,
};
