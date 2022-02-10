const HttpError = require('../service/http-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(HttpError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    const userId = tokenService.validateAccessToken(accessToken);

    if (!userId) {
      return next(HttpError.UnauthorizedError());
    }
    next();
  } catch (err) {
    return next(HttpError.UnauthorizedError());
  }
};
