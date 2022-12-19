/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import passport from "passport";
import fnPassport from "passport-jwt";
import AuthenModel from "../model/authen.model.js";
import CookieModel from "../model/cookie.model.js";
import env from "../utils/env.js";

const { ExtractJwt, Strategy } = fnPassport;
const FIVE_MINS_LEFT = 5 * 60;

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    AuthenModel.getAccessTokenFromReq
  ]),
  secretOrKey: env.SECRET_APP,
  passReqToCallback: true,
  ignoreExpiration: true
};

export default (app) => {
  app.use(passport.initialize());
  passport.use(
    new Strategy(opts, async (req, payload, done) => {
      const accessTok = AuthenModel.getAccessTokenFromReq(req);
      // for auto renew access token

      if (payload.exp - Date.now() / 1000 <= FIVE_MINS_LEFT) {
        // renew token
        const tokens = await AuthenModel.renewAccessToken(
          payload.uid,
          accessTok,
          CookieModel.getRefreshToken(req.cookies)
        );
        if (!tokens) {
          // Failed to renew access token
          console.log("Failed to renew access token");
          done(null, false);
          return;
        }
        const { accessToken, refreshToken } = tokens;
        if (accessToken && refreshToken) {
          // stored in req.user;
          done(null, {
            auth: { accessToken, refreshToken }
          });
          return;
        }
      }
      done(null, {});
    })
  );
};
