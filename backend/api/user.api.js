/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
import express from "express";
import passport from "passport";
import AuthMW from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import mailingModel from "../model/mailing.model.js";
import UserModel from "../model/user.model.js";
import UserResetPwdModel from "../model/userResetPwd.model.js";

const router = express.Router();

function checkValidToken(token) {
  const { code, data } = AuthenModel.verifyConfirmationToken(token);
  switch (code) {
    case AuthenModel.TOKEN_EXPIRED:
      return {
        error: {
          status: 401,
          message: "Expired token"
        }
      };
    case AuthenModel.INVALID_TOKEN:
      return {
        error: {
          status: 400,
          message: "Invalid data"
        }
      };
    case AuthenModel.VALID_TOKEN:
    default:
      return {
        error: null,
        data
      };
  }
}

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  AuthMW.renewAccessToken,
  async (req, res) => {
    const ownerId = AuthenModel.getUidFromReq(req);
    const user = await UserModel.findById(ownerId);
    if (user) {
      return res.json({
        status: 0,
        info: {
          id: user._id,
          name: user.name,
          email: user.email,
          addr: user.addr,
          provider: user.provider,
          status: user.status
        }
      });
    }
    return res.json({
      status: 500,
      message: "Internal Error"
    });
  }
);

router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  AuthMW.renewAccessToken,
  async (req, res) => {
    const { name, addr } = req.body;
    if (
      (!name && !addr) ||
      (name && name.trim().length === 0) ||
      (addr && addr.trim().length === 0)
    ) {
      return res.json({
        status: 422,
        message: "Invalid data"
      });
    }
    const ownerId = AuthenModel.getUidFromReq(req);
    const user = await UserModel.findById(ownerId);
    if (user) {
      let needUpdate = false;
      if (name && name.trim() !== user.name) {
        needUpdate = true;
        user.name = name.trim();
      }
      if (addr && addr.trim() !== user.addr) {
        needUpdate = true;
        user.addr = addr.trim();
      }

      if (needUpdate) {
        UserModel.add(user);
      }
      return res.json({
        status: 0
      });
    }
    return res.json({
      status: 500,
      message: "Internal Error"
    });
  }
);

router.post(
  "/password",
  passport.authenticate("jwt", { session: false }),
  AuthMW.renewAccessToken,
  async (req, res) => {
    const { curPwd, pwd } = req.body;
    if (
      !curPwd ||
      curPwd.trim().length === 0 ||
      !pwd ||
      pwd.trim().length === 0
    ) {
      return res.json({
        status: 422,
        message: "Invalid data"
      });
    }
    const ownerId = AuthenModel.getUidFromReq(req);
    const user = await UserModel.findById(ownerId);
    if (!UserModel.isSamePassword(curPwd, user.pwd)) {
      return res.json({
        status: 400,
        message: "Password is incorrect"
      });
    }
    if (!UserModel.isSamePassword(pwd, user.pwd)) {
      user.pwd = UserModel.encryptPassword(pwd);
      UserModel.add(user);
    }
    return res.json({
      status: 0
    });
  }
);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim().length === 0 || !UserModel.isValidEmail(email)) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const user = await UserModel.findByEmail(email.trim());
  if (user && !user.provider) {
    const token = AuthenModel.genConfirmationToken(user._id);
    UserResetPwdModel.saveToken(user._id, token);
    mailingModel.sendForgotPwdEmail({
      name: user.name,
      email: user.email,
      token,
      hours: 24
    });
  }
  // For case: user is not exist -> return success for safety purpose
  return res.json({
    status: 0
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, pwd } = req.body;
  if (!pwd || pwd.trim().length < 8 || !token || token.trim().length === 0) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const { error, data } = checkValidToken(token);
  if (error) {
    return res.json(error);
  }
  const userResetPwd = await UserResetPwdModel.findById(data.uid);
  if (userResetPwd && userResetPwd.token === token) {
    UserResetPwdModel.delToken(data.uid);
    const encryptedPwd = UserModel.encryptPassword(pwd.trim());
    UserModel.updatePwd(data.uid, encryptedPwd);
    return res.json({
      status: 0
    });
  }
  return res.json({
    status: 401,
    message: "Expired token"
  });
});

router.post("/validate-reset-password", async (req, res) => {
  const { token } = req.body;
  if (!token || token.trim().length === 0) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const { error, data } = checkValidToken(token);
  if (error) {
    return res.json(error);
  }
  const userResetPwd = await UserResetPwdModel.findById(data.uid);
  if (userResetPwd && userResetPwd.token === token) {
    return res.json({ status: 0 });
  }
  return res.json({
    status: 401,
    message: "Expired token"
  });
});

export default router;
