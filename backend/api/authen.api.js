import express from "express";
import passport from "passport";
import AuthModel from "../model/authen.model";
import CookieModel from "../model/cookie.model";
import AuthMW from "../middleware/authen.mw";

const router = express.Router();

function genNewTokens(res, uid) {
  const tok = AuthModel.genNewTokens(0);
  CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, tok.accessToken);
  CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, tok.refreshToken);
  CookieModel.setField(res, CookieModel.UID, uid);
  // console.log(tok);
  return tok;
}

router.post("/renew-access-token", (req, res) => {
  return res.json(AuthModel.renewAccessToken());
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true
  }),
  (req, res) => {
    return res.json(genNewTokens(res, 0));
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true
  }),
  (req, res) => {
    return res.json(genNewTokens(res, 0));
  }
);

router.get("/logout", AuthMW.stopWhenNotLogon, (req, res) => {
  // const refreshTok = CookieModel.getRefreshToken(req.cookies);
  // const accessTok = CookieModel.getAccessToken(req.cookies);
  // const uid = CookieModel.getField(req.cookies, CookieModel.UID);

  CookieModel.removeField(CookieModel.ACCESS_TOKEN);
  CookieModel.removeField(CookieModel.REFRESH_TOKEN);
  CookieModel.removeField(CookieModel.UID);
  // Just remove access token, cookie, uid from cookie of request and response to client
  res.json({
    code: 200,
    message: "Logged out"
  });

  // TO_DO: check if access token, refresh are valid
  // and refresh token belongs to uid
  // and uid must be exist in database
  // then remove refresh token from database
  // ....
});

export default router;
