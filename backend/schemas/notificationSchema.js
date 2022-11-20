import db, { Schema } from "../utils/database";

const Notifications = new Schema(
  {
    _id: String,
    notifications: [
      {
        type: Number,
        data: String
      }
    ]
  },
  { versionKey: false }
);

const Notification = db.model("notifications", Notifications);
export default Notification;
