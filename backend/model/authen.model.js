/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import jwt from "jsonwebtoken";
import env from "../utils/env.js";
import CookieModel from "./cookie.model.js";
import UserModel from "./user.model.js";

function genToken(data, isLongTime = false) {
  return jwt.sign(data, env.SECRET_APP, {
    expiresIn: isLongTime ? env.EXP_TOK_LONG_TIME : env.EXP_TOK_TIME
  });
}

function genTokenCustomTime(data, time) {
  return jwt.sign(data, env.SECRET_APP, { expiresIn: time });
}

const verifyExpireTime = "1d";
const VALID_AUTH_TYPE = "Bearer";

export default {
  TOKEN_EXPIRED: 1,
  VALID_TOKEN: 0,
  INVALID_TOKEN: -1,

  getUidFromReq(req) {
    const accessTok = this.getAccessTokenFromReq(req);
    const ownerId = this.getUidFromToken(accessTok);
    return ownerId;
  },

  getAccessTokenFromReq(req) {
    let authStr = req.headers.authorization;
    if (
      !authStr ||
      authStr.split(" ").length !== 2 ||
      authStr.split(" ")[0] !== VALID_AUTH_TYPE
    ) {
      authStr = CookieModel.getAccessToken(req.cookies);
      if (!authStr) {
        return null;
      }
    }

    let accessTok = authStr.split(" ")[1];
    if (!accessTok) {
      accessTok = authStr;
    }
    return accessTok;
  },

  getUidFromToken(token) {
    if (!token) {
      return null;
    }
    const data = this.verifyAccessToken(token, false);
    if (data.code === this.VALID_TOKEN && data.data !== null) {
      return data.data.uid;
    }
    return null;
  },

  getData(token) {
    try {
      return jwt.verify(token, env.SECRET_APP);
    } catch (err) {
      return null;
    }
  },

  verifyAccessToken(token, isCheckExpiredTime = true) {
    let res = null;
    try {
      res = jwt.verify(token, env.SECRET_APP, {
        ignoreExpiration: !isCheckExpiredTime
      });
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return { code: this.TOKEN_EXPIRED, data: null };
        default:
          return { code: this.INVALID_TOKEN, data: null };
      }
    }
    return { code: this.VALID_TOKEN, data: res };
  },

  verifyRefreshToken(refreshToken, accessToken, uid) {
    let result = null;
    try {
      result = jwt.verify(refreshToken, env.SECRET_APP);
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return this.TOKEN_EXPIRED;
        default:
          return this.INVALID_TOKEN;
      }
    }
    if (result.uid === uid && result.accessToken === accessToken) {
      return this.VALID_TOKEN;
    }
    return this.INVALID_TOKEN;
  },

  async renewAccessToken(userId, accessTok, refreshTok) {
    if (!userId || !accessTok || !refreshTok) {
      return null;
    }
    // TO_DO: check if refresh token is valid (use jwt.verify and check data inside)
    const isValid = this.verifyRefreshToken(refreshTok, accessTok, userId);
    if (isValid !== this.VALID_TOKEN) {
      return null;
    }

    // check cur refresh token must be in database
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }

    // renew access token and
    // also renew refresh token when it was used
    const tokens = this.genNewTokens(userId);

    const replaceIndex = user.refreshTokens.indexOf(refreshTok);
    if (replaceIndex === -1) {
      user.refreshTokens.push(tokens.refreshToken);
    } else {
      user.refreshTokens[replaceIndex] = tokens.refreshToken;
    }

    // TO_DO: store new refresh token in database
    const result = await UserModel.add(user);
    if (!result) {
      return null;
    }
    return tokens;
  },

  genNewTokens(userId) {
    const newAccessTok = genToken({ uid: userId });
    const newRefreshTok = genToken(
      {
        uid: userId,
        accessToken: newAccessTok
      },
      true
    );

    return {
      accessToken: newAccessTok,
      refreshToken: newRefreshTok
    };
  },

  genConfirmationToken(uid) {
    const buff = Buffer.from(genTokenCustomTime({ uid }, verifyExpireTime));
    return buff.toString("base64");
  },

  verifyConfirmationToken(tokenBase64) {
    const token = Buffer.from(tokenBase64, "base64").toString("ascii");
    let res = null;
    try {
      res = jwt.verify(token, env.SECRET_APP);
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return {
            code: this.TOKEN_EXPIRED,
            data: null
          };
        default:
          return {
            code: this.INVALID_TOKEN,
            data: null
          };
      }
    }
    return {
      code: this.VALID_TOKEN,
      data: res
    };
  },

  genPermanentGroupInvitationToken(gId) {
    const buff = Buffer.from(jwt.sign({ gId }, env.SECRET_APP));
    return buff.toString("base64");
  },

  verifyGroupInvitationToken(tokenBase64) {
    return this.verifyConfirmationToken(tokenBase64);
  },

  async login(res, user) {
    const uid = user._id.toString();
    const { accessToken, refreshToken } = this.genNewTokens(uid);
    user.refreshTokens.push(refreshToken);
    await UserModel.add(user);
    CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, accessToken);
    CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, refreshToken);
    CookieModel.setField(res, CookieModel.UID, uid);
    return {
      id: uid,
      accessToken,
      refreshToken,
      name: user.name,
      email: user.email,
      addr: user.addr,
      status: user.status
    };
  },

  async logout(accessToken, refreshToken) {
    // check if access token, refresh are valid
    const accessTokenData = this.verifyAccessToken(accessToken);
    if (
      !accessTokenData ||
      !accessTokenData.data ||
      !accessTokenData.data.uid
    ) {
      return false;
    }
    const refreshTokenData = this.verifyRefreshToken(
      refreshToken,
      accessToken,
      accessTokenData.uid
    );
    if (refreshTokenData !== this.VALID_TOKEN) {
      return false;
    }

    // refresh token belongs to uid && uid must be exist in db
    const user = await UserModel.findById(accessTokenData.uid);
    if (!user || user.refreshTokens.indexOf(refreshToken) === -1) {
      return false;
    }
    await UserModel.removeRefreshToken(accessTokenData.uid, refreshToken);
    return true;
  }
};
