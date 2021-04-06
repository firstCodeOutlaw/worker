class Response {
    /**
     * Class Constructor
     *
     * @param expressJsResponseObject
     * @param message
     */
    constructor(expressJsResponseObject, message = '') {
        this.response = expressJsResponseObject;
        this.message = message;
    }

    /**
     * Build headers and response body based on the method called
     * in this class.
     *
     * @param data
     * @param error
     * @param pagination
     * @returns {*}
     * @private
     */
    _dispatch(data = null, error = null, pagination = null) {
        const bag = { message: this.message };

        if (pagination) {
            bag.currentPage = pagination.page;
            if (pagination.total > pagination.recordsPerPage) bag.nextPage = pagination.page + 1;
            if (pagination.page > 1) bag.previousPage = pagination.page - 1;
            bag.recordsPerPage = pagination.recordsPerPage;
            bag.numberOfPages = Math.ceil(pagination.total/pagination.recordsPerPage);
            bag.totalNumberOfRecords = pagination.total;
        }

        if (data) bag.data = data;
        else if (error) bag.error = error;

        return this.response.status(this.statusCode).send(bag);
    }

    /**
     * Return a bad request response
     *
     * @param error
     * @returns {*}
     */
    badRequest(error) {
        this.statusCode = 422;
        if (!this.message) this.message = error.message || 'Bad request';
        return this._dispatch(null, error);
    }

    /**
     * Return a HTTP 201 resource created response
     *
     * @param data
     * @returns {*}
     */
    created(data) {
        this.statusCode = 201;
        if (!this.message) this.message = 'Created';
        return this._dispatch(data);
    }

    /**
     * Return a HTTP 403 forbidden response
     *
     * @param error
     * @returns {*}
     */
    forbidden(error) {
        this.statusCode = 403;
        if (!this.message) this.message = error.message || 'Request is forbidden';
        return this._dispatch(null, error);
    }

    /**
     * Return a HTTP 200 response
     *
     * @param data
     * @param pagination
     * @returns {*}
     */
    ok(data, pagination = null) {
        this.statusCode = 200;
        if (!this.message) this.message = 'Success';
        return this._dispatch(data, null, pagination);
    }

    /**
     * Return a HTTP 204 no content response
     *
     * @returns {*}
     */
    noContent() {
        this.statusCode = 204;
        return this.response.status(this.statusCode).send();
    }

    /**
     * Return a HTTP 409 conflict response
     *
     * @returns {*}
     */
    conflict() {
        this.statusCode = 409;
        return this.response.status(this.statusCode).send();
    }

    /**
     * Returns a not found error response
     *
     * @param error
     * @returns {*}
     */
    notFound(error = null) {
        this.statusCode = 404;
        if (!this.message) this.message = error.message || 'Resource not found';
        return this._dispatch(null, error);
    }

    /**
     * Return a internal server error response
     *
     * @param error
     * @returns {*}
     */
    serverError(error) {
        this.statusCode = 500;
        if (!this.message) this.message = error.message || 'Internal server error';
        return this._dispatch(null, error);
    }
}

module.exports = Response;
