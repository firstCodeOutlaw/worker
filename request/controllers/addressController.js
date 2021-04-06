const Address = require('../../database/models/address');
const {
    addressSchema,
    paginationSchema,
    addressIdValidator,
    updateAddressSchema,
    canUpdateAddressStatus
} = require('../validators');
const Response = require('../../helpers/reponse');

/**
 * Get all available addresses
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
const getAllAddresses = async (request, response) => {
    try {
        const { recordsPerPage, page } = await paginationSchema.validateAsync({
            recordsPerPage: request.query.recordsPerPage,
            page: request.query.page
        });

        const addressesCount = await Address.countDocuments();
        const addresses = await Address.find()
            .skip((page - 1) * recordsPerPage)
            .limit(recordsPerPage);

        new Response(response).ok(addresses, {
            total: addressesCount,
            page: page,
            recordsPerPage: recordsPerPage
        });
    }
    catch (error) {
        if (error.isJoi) {
            return new Response(response).badRequest(error);
        }

        return new Response(response).serverError(error);
    }
};

/**
 * Create a new address
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
const createAddress = async (request, response) => {
    try {
        // Validate request
        const validated = await addressSchema.validateAsync(request.body);
        const address = new Address(validated);
        const result = await address.save();
        new Response(response).created(result);
    }
    catch (error) {
        if (error.isJoi) {
            return new Response(response).badRequest(error);
        }

        return new Response(response).serverError(error);
    }
};

/**
 * Return a specific address
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
const getAddress = async (request, response) => {
    try {
        const validated = await addressIdValidator(request.params.id);
        const address = await Address.findById(validated.id);
        new Response(response).ok(address);
    }
    catch (error) {
        if (error.isJoi) {
            return new Response(response).notFound(error);
        }

        return new Response(response).serverError(error);
    }
};

/**
 * Modify an existing address
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
const updateAddress = async (request, response) => {
    try {
        // Validate address id and request body
        const { id } = await addressIdValidator(request.params.id);
        const validated = await updateAddressSchema.validateAsync(request.body);
        const address = await Address.findById(id);
        address.status = canUpdateAddressStatus(address.status, validated.status);
        address.name = validated.name ? validated.name : address.name;
        address.email = validated.email ? validated.email : address.email;
        const result = await address.save();

        new Response(response).created(result);
    }
    catch (error) {
        if (error.isJoi) {
            return new Response(response).badRequest(error);
        }

        if (error instanceof Error) {
            return new Response(response).forbidden(error);
        }

        return new Response(response).serverError(error);
    }
};

/**
 * Delete an address
 *
 * @param request
 * @param response
 */
const deleteAddress = async (request, response) => {
    try {
        // Validate address id
        const { id } = await addressIdValidator(request.params.id);
        Address.findByIdAndDelete(id, error => {
            if (error) throw error;
            else console.log('Deletion success');
        });
        new Response(response).noContent();
    }
    catch (error) {
        if (error.isJoi) {
            return new Response(response).badRequest(error);
        }

        if (error instanceof Error) {
            return new Response(response).conflict();
        }

        return new Response(response).serverError(error);
    }
};

module.exports = {
    getAll: getAllAddresses,
    getOne: getAddress,
    post: createAddress,
    update: updateAddress,
    delete: deleteAddress
};
