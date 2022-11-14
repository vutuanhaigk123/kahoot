import passport from "passport";
import express from "express";
import AuthMW from "../middleware/authen.mw";

const router = express.Router();

router.get(
  "/facebook",
  AuthMW.stopWhenLogon,
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/google",
  AuthMW.stopWhenLogon,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

export default router;
