const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const ReasonStatusCode = {
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Conflict error",
  UNPROCESSABLE_ENTITY: "Validation failed",
  TOO_MANY_REQUESTS: "Too many requests",
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.CONFLICT,
    statusCode: number = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.FORBIDDEN,
    statusCode: number = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.BAD_REQUEST,
    statusCode: number = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.UNAUTHORIZED,
    statusCode: number = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.NOT_FOUND,
    statusCode: number = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export class ValidationError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.UNPROCESSABLE_ENTITY,
    statusCode: number = StatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
  }
}

export class TooManyRequestsError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.TOO_MANY_REQUESTS,
    statusCode: number = StatusCode.TOO_MANY_REQUESTS
  ) {
    super(message, statusCode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode: number = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
