/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Slides = new Schema(
  {
    _id: String,
    presentationId: String,
    question: String,
    type: Number,
    answers: [
      {
        _id: String,
        des: String,
        choiceUids: [String]
      }
    ]
  },
  { versionKey: false }
);

const Slide = db.model("slides", Slides);
export default Slide;
