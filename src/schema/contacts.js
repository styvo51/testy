const Joi = require("@hapi/joi");

const ContactSchema = Joi.object().keys({
  street: Joi.string().label("Street").uppercase().required(),
  city: Joi.string().label("City").uppercase().required(),
  postcode: Joi.number().label("Postcode").required(),
  state: Joi.string()
    .label("State")
    .uppercase()
    .pattern(/QLD|NSW|ACT|VIC|TAS|NT|WA|SA/)
    .required(),
});

module.exports = { ContactSchema };
