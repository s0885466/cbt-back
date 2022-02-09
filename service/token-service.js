const jwt = require('jsonwebtoken');

const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '10h',
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
}

module.exports = new TokenService();
