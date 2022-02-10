const jwt = require('jsonwebtoken');

const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '2h',
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '2d',
      }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken, session) {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
      return tokenData;
    }

    const token = new tokenModel({ user: userId, refreshToken });

    if (session) {
      await token.save({ session });
    } else {
      await token.save();
    }

    return token;
  }

  validateRefreshToken(refreshToken) {
    try {
      const { userId } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );

      return userId;
    } catch (err) {
      return null;
    }
  }

  validateAccessToken(accessToken) {
    try {
      const { userId } = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );

      return userId;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new TokenService();
