/* eslint-disable consistent-return */
/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import CookieModel from "../model/cookie.model.js";
import AuthModel from "../model/authen.model.js";

const FIVE_MINS_LEFT = 5 * 60;

export default {
  async stopWhenNotLogon(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    if (accessTok === null) {
      return res.json({
        code: 401,
        message: "No permission to access"
      });
    }

    let isExpired = false;
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    switch (code) {
      case AuthModel.INVALID_TOKEN:
        return res.json({
          code: 400,
          message: "Invalid access token"
        });
      case AuthModel.TOKEN_EXPIRED:
        isExpired = true;
      default:
        if (isExpired || data.exp - Date.now() / 1000 <= FIVE_MINS_LEFT) {
          // renew token
          const { accessToken, refreshToken } =
            await AuthModel.renewAccessToken(
              data.uid,
              accessTok,
              CookieModel.getRefreshToken(req.cookies)
            );
          if (accessToken && refreshToken) {
            CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, accessToken);
            CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, refreshToken);
          } else if (isExpired) {
            return res.json({
              code: 400,
              message: "Invalid access token"
            });
          }
        }
        next();
    }
  },

  stopWhenLogon(req, res, next) {
    const authStr = req.headers.authorization;
    if (
      authStr ||
      CookieModel.getAccessToken(req.cookies) ||
      CookieModel.getRefreshToken(req.cookies)
    ) {
      return res.json({
        code: 200,
        message: "You logged in"
      });
    }
    next();
  }
};
