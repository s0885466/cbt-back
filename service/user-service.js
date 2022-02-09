const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model');
const HttpError = require('./http-error');
const UserDto = require('../dtos/user-dto');
const tokenService = require('./token-service');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

class UserService {
  async saveUser(email, password, roles) {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw HttpError.CustomError(404, 'User already exists, try it again');
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = new UserModel({ email, password: hashPassword, roles });

    let tokens;

    try {
      const session = await mongoose.startSession();
      await session.startTransaction();
      await newUser.save({ session });

      const { refreshToken, accessToken } = tokenService.generateTokens({
        userId: newUser.id,
        password: hashPassword,
      });

      await tokenService.saveToken(newUser.id, refreshToken, session);
      await session.commitTransaction();

      tokens = { refreshToken, accessToken };
    } catch (err) {
      throw new Error(err);
    }

    const userDto = new UserDto(newUser);

    return {
      user: userDto,
      ...tokens,
    };
  }
}

module.exports = new UserService();
