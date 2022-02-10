const userService = require('../service/user-service');
const RoleModel = require('../models/role-model');

class AuthController {
  setCookieRefreshToken(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
  }

  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      const role = new RoleModel();
      const roles = [role];
      const { user, refreshToken, accessToken } = await userService.saveUser(
        email,
        password,
        roles
      );

      this.setCookieRefreshToken(res, refreshToken);

      res.status(201).json({ user, accessToken: accessToken });
    } catch (err) {
      return next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, refreshToken, accessToken } = await userService.login(
        email,
        password
      );

      this.setCookieRefreshToken(res, refreshToken);

      res.status(200).json({ user, accessToken: accessToken });
    } catch (err) {
      return next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const newTokens = await userService.refresh(refreshToken);

      this.setCookieRefreshToken(res, newTokens.refreshToken);

      res.status(200).json({ accessToken: newTokens.accessToken });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
