const userService = require('../service/user-service');
const RoleModel = require('../models/role-model');

class AuthController {
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

      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.status(201).json({ user, accessToken: accessToken });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
