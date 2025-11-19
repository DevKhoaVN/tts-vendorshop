const statusCode = {
    OK: 200,
    CREATED: 201
};

const reasonStatusCode = {
    200: "OK",
    201: "CREATED"
};


class SuccessResponse {
    constructor({ message, status = statusCode.OK, reason = reasonStatusCode[statusCode.OK], metadata = {} }) {
        this.message = message || reason;
        this.status = status;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}


class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.OK, reason: reasonStatusCode[statusCode.OK], metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.CREATED, reason: reasonStatusCode[statusCode.CREATED], metadata });
    }
}


module.exports = {
    OK,
    CREATED
}