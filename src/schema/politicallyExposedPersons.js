const joi = require("@hapi/joi");

const PepsSchema = joi.object({
  firstName: joi.string().trim().required(),
  lastName: joi.string().trim().required(),
  dateOfBirth: joi
    .string()
    .pattern(/^\d{4}-[01]\d-[0123]\d$/, "YYYY-MM-DD")
    .required(),
  gender: joi
    .string()
    .pattern(/^(Male|Female|X)$/)
    .message('"gender" must be Male, Female, or X')
    .required(),
});

module.exports = { PepsSchema };
