const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().min(3).max(100).messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),
        description: Joi.string().required().min(10).max(500).messages({
            'string.base': 'Description must be a string',
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 500 characters',
            'any.required': 'Description is required'
        }),
        price: Joi.number().min(0).required().messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),
        location: Joi.object({
            address: Joi.string().required().max(200).messages({
                'string.base': 'Address must be a string',
                'string.max': 'Address cannot exceed 200 characters',
                'any.required': 'Address is required'
            }),
            city: Joi.string().required().max(50).messages({
                'string.base': 'City must be a string',
                'string.max': 'City cannot exceed 50 characters',
                'any.required': 'City is required'
            }),
            area: Joi.string().required().max(50).messages({
                'string.base': 'Area must be a string',
                'string.max': 'Area cannot exceed 50 characters',
                'any.required': 'Area is required'
            })
        }).required().messages({
            'object.base': 'Location must be an object'
        }),
        rating: Joi.number().min(0).max(5).required().messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating cannot be less than 0',
            'number.max': 'Rating cannot exceed 5',
            'any.required': 'Rating is required'
        }),
        available: Joi.boolean(),
        amenities: Joi.array().items(Joi.string()).optional().messages({
            'array.base': 'Amenities must be an array of strings'
        })
    }).required()
}).unknown(false);

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports = { listingSchema, validateListing };
