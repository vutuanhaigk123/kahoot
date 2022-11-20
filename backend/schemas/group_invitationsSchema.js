import db, { Schema } from "../utils/database";

const GroupInvitations = new Schema(
  {
    uid: String,
    groupId: String
  },
  { versionKey: false }
);

const GroupInvitation = db.model("group_invitations", GroupInvitations);
export default GroupInvitation;
