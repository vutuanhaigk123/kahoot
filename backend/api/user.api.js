/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable import/extensions */
import express from "express";
import passport from "passport";
import AuthMW from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import UserModel from "../model/user.model.js";

const router = express.Router();

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

export default router;
