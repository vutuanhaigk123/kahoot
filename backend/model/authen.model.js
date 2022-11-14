/* eslint-disable no-console */
import jwt from "jsonwebtoken";
import env from "../utils/env";

function genToken(data, isLongTime = false) {
  return jwt.sign(data, env.SECRET_APP, {
    expiresIn: isLongTime ? env.EXP_TOK_LONG_TIME : env.EXP_TOK_TIME
  });
}

export default {
  TOKEN_EXPIRED: 1,
  VALID_TOKEN: 0,
  INVALID_TOKEN: -1,

  getData(token) {
    try {
      return jwt.verify(token, env.SECRET_APP);
    } catch (err) {
      return null;
    }
  },

  verifyToken(token) {
    try {
      jwt.verify(token, env.SECRET_APP);
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return this.TOKEN_EXPIRED;
        default:
          return this.INVALID_TOKEN;
      }
    }
    return this.VALID_TOKEN;
  },

  renewAccessToken(userId, refreshTok) {
    // TO_DO: check if refresh token is valid (use jwt.verify and check data inside and cur refresh token must be in database)
    // ...

    // renew access token and
    // also renew refresh token when it was used
    console.log(refreshTok);
    const tokens = this.genNewTokens(userId);

    // TO_DO: store new refresh token in database

    return tokens;
  },

  genNewTokens(userId) {
    const newAccessTok = genToken({ uid: userId });
    const newRefreshTok = genToken(
      {
        uid: userId,
        refreshToken: newAccessTok
      },
      true
    );

    return {
      accessToken: newAccessTok,
      refreshToken: newRefreshTok
    };
  }
};
