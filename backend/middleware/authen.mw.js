import CookieModel from "../model/cookie.model";
import AuthModel from "../model/authen.model";

const VALID_AUTH_TYPE = "Bearer";

export default {
  // eslint-disable-next-line consistent-return
  async stopWhenNotLogon(req, res, next) {
    let authStr = req.headers.authorization;
    if (
      !authStr ||
      authStr.split(" ").length !== 2 ||
      authStr.split(" ")[0] !== VALID_AUTH_TYPE
    ) {
      authStr = CookieModel.getAccessToken(req.cookies);
      if (!authStr) {
        return res.json({
          code: 401,
          message: "No permission to access"
        });
      }
    }

    let accessTok = authStr.split(" ")[1];
    if (!accessTok) {
      accessTok = authStr;
    }

    // eslint-disable-next-line prefer-const
    let isInvalidToken = false;
    if (accessTok) {
      switch (AuthModel.verifyToken(accessTok)) {
        case AuthModel.TOKEN_EXPIRED:
          // eslint-disable-next-line no-console
          console.log("Token expired");
          // TO_DO
          // renew token
          break;
        case AuthModel.INVALID_TOKEN:
          return res.json({
            code: 400,
            message: "Invalid access token"
          });
        default:
          next();
      }
    }
    if (!accessTok || isInvalidToken) {
      res.json({
        code: 401,
        message: "No permission to access"
      });
    }
  },

  // eslint-disable-next-line consistent-return
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
