const Joi = require('joi');
const mongoose = require('mongoose');
const country = require('iso-3166-1');

module.exports = {
    // Validates an address object before creating it
    addressSchema: Joi.object({
        country: Joi.string().required().custom((value, helpers) => {
            const valid = country.whereAlpha2(value);
            if (valid) return value;
            return helpers.message('Country is not a valid ISO-3166-1 string');
        }),
        city: Joi.string().min(3).max(40).required(),
        street: Joi.string().min(3).max(20).required(),
        postalCode: Joi.string().length(5).regex(/^[0-9]+$/) .required(),
        number: Joi.number().min(1).required(),
        numberAddition: Joi.string().allow("").default(""),
        status: Joi.string().default(null),
        name: Joi.string().default(null),
        email: Joi.string().email({ minDomainSegments: 2 }).default(null)
    }),

    // Validates pagination parameters supplied as URL query strings
    paginationSchema: Joi.object({
        recordsPerPage: Joi.number().min(5).max(100).default(20),
        page: Joi.number().min(1).default(1)
    }),

    // Validates an address object before update
    updateAddressSchema: Joi.object({
        status: Joi.string().required().valid('not at home', 'not interested', 'interested'),
        name: Joi.string().optional(),
        email: Joi.string().email({ minDomainSegments: 2 }).optional()
    }),

    // Validate that status can be updated
    canUpdateAddressStatus: (currentStatus, newStatus) => {
        switch (currentStatus) {
            case 'not interested':
            case 'interested':
                throw new Error(`No changes allowed when status is \"${currentStatus}\"`);
            default:
                return newStatus;
        }
    },

    /**
     * Validates whether a document with the specified id exists in MongoDB
     *
     * @param id {string}
     * @returns {Promise<{id}>}
     */
    addressIdValidator: async (id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return { id: id };
        }
        throw new Joi.ValidationError(
            `Document with object Id ${id} not found`,
            { id: id },
            { id: id }
        );
    },
}
