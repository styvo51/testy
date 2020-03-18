const Joi = require("@hapi/joi");

const personId = Joi.number()
  .integer()
  .min(1)
  .label("Person ID");
const firstName = Joi.string().label("First Name");
const lastName = Joi.string().label("Last Name");
const dob = Joi.date().label("Date of Birth");
const street = Joi.string().label("Street");
const city = Joi.string().label("City");
const state = Joi.string().label("State");
const postcode = Joi.string().label("Postcode");
const email = Joi.string().label("Email");
const mobile = Joi.string().label("Mobile");

const matchSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  dob: dob.required(),
  street: street.required(),
  city: city.required(),
  state: state.required(),
  postcode: postcode.required(),
  email: email.required(),
  mobile: mobile.required()
});

const confirmSchema = Joi.object({
  personId: personId.required()
});

module.exports = { matchSchema, confirmSchema };
