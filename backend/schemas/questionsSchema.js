/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Questions = new Schema(
  {
    _id: String, // presentationId
    contents: [
      {
        _id: String, // presentationId
        userId: String,
        content: String,
        ts: Number,
        isAnswered: Boolean,
        upVotes: [String],
        name: String
      }
    ]
  },
  { versionKey: false }
);

const Question = db.model("questions", Questions);
export default Question;
