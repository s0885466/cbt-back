module.exports = class HttpError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.code = errorCode;
  }

  static InternalServerError() {
    return new HttpError(500, 'Internal server error');
  }

  static UnauthorizedError() {
    return new HttpError(401, 'User is unauthorized');
  }

  static CustomError(errorCode, message) {
    return new HttpError(errorCode, message);
  }
};
