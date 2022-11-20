/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Groups = new Schema(
  {
    _id: String,
    name: String,
    inviteToken: String,
    members: [
      {
        _id: String,
        role: Number,
        ts: Number
      }
    ]
  },
  { versionKey: false }
);

const Group = db.model("groups", Groups);
export default Group;
