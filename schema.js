const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    image: Joi.string().allow("", null)
});
