/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import bcrypt from "bcrypt";
import { STATUS_ACCOUNT, getNewObjectId } from "../utils/database.js";
import AuthenModel from "./authen.model.js";
import User from "../schemas/userSchema.js";

async function createAccountByThirdParty(email, name, provider, add) {
  const uid = getNewObjectId().toString();
  const { accessToken, refreshToken } = AuthenModel.genNewTokens(uid);
  const user = new User({
    _id: uid,
    email,
    name,
    pwd: null,
    addr: null,
    provider,
    status: STATUS_ACCOUNT.activated,
    refreshTokens: [refreshToken]
  });
  const newUser = await add(user);
  if (newUser === null) {
    return {
      code: -101,
      userInfo: null
    };
  }
  return {
    code: 0,
    userInfo: user,
    accessToken,
    refreshToken
  };
}

const regexEmailValidator =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  VERIFIED: 0,
  INVALID_VERIFY_TOKEN: -1,
  EXPIRED_VERIFY_TOKEN: -2,

  async findById(id) {
    const userRet = await User.findById({ _id: id }).exec();
    return userRet;
  },

  async findByEmail(emailInput) {
    const userRet = await User.findOne({ email: emailInput }).exec();
    return userRet;
  },

  async findUidsByEmailList(emailList) {
    const ret = await User.find({
      email: { $in: emailList }
    })
      .select({ _id: 1, email: 1 })
      .exec();
    if (ret.length) {
      const result = new Map();
      ret.forEach(({ _id, email }) => {
        return result.set(email, _id);
      });
      return result;
    }
    return null;
  },

  isValidEmail(email) {
    return email.toString().toLowerCase().search(regexEmailValidator) !== -1;
  },

  async getGeneralInfoByIds(uids, selected) {
    const res = await User.find().where("_id").in(uids).select(selected).exec();
    return res;
  },

  async findOrCreateByThirdParty(email, name, provider) {
    const userInfo = await this.findByEmail(email);
    if (!userInfo) {
      const res = await createAccountByThirdParty(
        email,
        name,
        provider,
        this.add
      );
      return res;
    }
    if (provider !== userInfo.provider) {
      return {
        code: -100,
        userInfo: null
      };
    }
    const { accessToken, refreshToken } = AuthenModel.genNewTokens(
      userInfo._id.toString()
    );
    userInfo.refreshTokens.push(refreshToken);
    this.add(userInfo);
    return {
      code: 0,
      userInfo,
      accessToken,
      refreshToken
    };
  },

  async add(user) {
    try {
      const ret = await user.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create({ email, name, addr, password }) {
    const pwd = this.encryptPassword(password);
    const uid = getNewObjectId().toString();
    const { accessToken, refreshToken } = AuthenModel.genNewTokens(uid);
    const user = new User({
      _id: uid,
      email,
      name,
      pwd,
      addr,
      provider: null,
      status: STATUS_ACCOUNT.verifying,
      refreshTokens: [refreshToken]
    });
    const newUser = await this.add(user);
    if (newUser) {
      return {
        user,
        accessToken,
        refreshToken
      };
    }
    return null;
  },

  encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },

  isSamePassword(password, orgPwd) {
    return bcrypt.compareSync(password, orgPwd);
  },

  async removeRefreshToken(uid, refreshToken) {
    // remove from Users schema
    await User.updateOne(
      { _id: uid },
      {
        $pullAll: {
          refreshTokens: [refreshToken]
        }
      }
    );
  },

  async verifyUser(verifyToken) {
    const info = AuthenModel.verifyConfirmationToken(verifyToken);
    if (!info.data) {
      switch (info.code) {
        case AuthenModel.INVALID_TOKEN:
          return this.INVALID_VERIFY_TOKEN;
        case AuthenModel.TOKEN_EXPIRED:
          return this.EXPIRED_VERIFY_TOKEN;
        default:
          return this.INVALID_VERIFY_TOKEN;
      }
    }
    const { uid } = info.data;
    console.log(info);
    const user = await this.findById(uid);
    if (!user) {
      return this.INVALID_VERIFY_TOKEN;
    }
    if (user.status !== STATUS_ACCOUNT.activated) {
      user.status = STATUS_ACCOUNT.activated;
      this.add(user);
      return this.VERIFIED;
    }
    return this.EXPIRED_VERIFY_TOKEN;
  }
};
