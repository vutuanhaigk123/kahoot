/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const UserGroupSchema = new Schema(
  {
    _id: String,
    joined_groups: [String],
    created_groups: [String]
  },
  { versionKey: false }
);

const UserGroups = db.model("user_groups", UserGroupSchema);
export default UserGroups;
