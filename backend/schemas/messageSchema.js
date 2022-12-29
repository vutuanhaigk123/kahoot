/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Messages = new Schema(
  {
    _id: String, // presentationId
    contents: [
      {
        _id: String, // messageId
        userId: String,
        text: String,
        ts: Number,
        name: String
      }
    ]
  },
  { versionKey: false }
);

const Message = db.model("messages", Messages);
export default Message;
