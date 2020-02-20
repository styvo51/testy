const Joi = require("@hapi/joi");

const ConfirmSchema = Joi.object().keys({
  firstName: Joi.string()
    .label("First Name")
    .required(),
  lastName: Joi.string()
    .label("Last Name")
    .required(),
  nicknames: Joi.array()
    .items(Joi.string())
    .required(),
  address1: Joi.string()
    .label("Address 1")
    .required(),
  address2: Joi.string()
    .label("Address 2")
    .required(),
  postcode: Joi.number()
    .label("Postcode")
    .required(),
  state: Joi.string()
    .label("State")
    .uppercase()
    .pattern(/QLD|NSW|ACT|VIC|TAS|NT|WA|SA/)
    .required()
});

module.exports = ConfirmSchema;
