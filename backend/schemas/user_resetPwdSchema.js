/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const UsersResetPwd = new Schema(
  {
    _id: String,
    token: String
  },
  { versionKey: false }
);

const UserResetPwd = db.model("users_resetpwd", UsersResetPwd);
export default UserResetPwd;
