const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model');
const HttpError = require('./http-error');
const UserDto = require('../dtos/user-dto');
const tokenService = require('./token-service');
const mongoose = require('mongoose');

const SALT = 5;

class UserService {
  async saveUser(email, password, roles) {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw HttpError.CustomError(404, 'User already exists, try it again');
    }

    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = new UserModel({ email, password: hashedPassword, roles });

    let tokens;

    try {
      const session = await mongoose.startSession();
      await session.startTransaction();
      await newUser.save({ session });

      const { refreshToken, accessToken } = tokenService.generateTokens({
        userId: newUser.id,
        email,
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

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw HttpError.CustomError(403, 'User is not exists');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw HttpError.CustomError(403, 'Email and Password do not match');
    }

    const { refreshToken, accessToken } = tokenService.generateTokens({
      userId: user.id,
      email,
    });

    await tokenService.saveToken(user.id, refreshToken);

    const userDto = new UserDto(user);

    return {
      user: userDto,
      refreshToken,
      accessToken,
    };
  }
}

module.exports = new UserService();
