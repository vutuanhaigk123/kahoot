/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Users = new Schema(
  {
    _id: String,
    name: String,
    email: String,
    addr: String,
    pwd: String,
    provider: String,
    status: Number,
    refreshTokens: [String]
  },
  { versionKey: false }
);

const User = db.model("users", Users);
export default User;
