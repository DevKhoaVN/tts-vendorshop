const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Resource not found",
    CONFLICT: "Conflict error",
    UNPROCESSABLE_ENTITY: "Validation failed",
    TOO_MANY_REQUESTS: "Too many requests",
    INTERNAL_SERVER_ERROR: "Internal server error",
};


class ErrorResponse extends Error{
    constructor(message , statusCode ){
        super(message)
        this.statusCode = statusCode
    }
}

class ConflictRequestError extends ErrorResponse{
   constructor(message = ReasonStatusCode.CONFLICT , statusCode = StatusCode.CONFLICT){
    super(message , statusCode)
   }
}

class ForbiddenRequestError extends ErrorResponse{
   constructor(message = ReasonStatusCode.ForbiddenRequestError , statusCode = StatusCode.FORBIDDEN){
    super(message , statusCode)
   }
}
class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.BAD_REQUEST,
        statusCode = StatusCode.BAD_REQUEST
    ) {
        super(message, statusCode);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.UNAUTHORIZED,
        statusCode = StatusCode.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.NOT_FOUND,
        statusCode = StatusCode.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

class ValidationError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.UNPROCESSABLE_ENTITY,
        statusCode = StatusCode.UNPROCESSABLE_ENTITY
    ) {
        super(message, statusCode);
    }
}

class TooManyRequestsError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.TOO_MANY_REQUESTS,
        statusCode = StatusCode.TOO_MANY_REQUESTS
    ) {
        super(message, statusCode);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
        statusCode = StatusCode.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    ForbiddenRequestError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ValidationError,
    TooManyRequestsError,
    InternalServerError
}