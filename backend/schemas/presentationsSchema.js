/* eslint-disable import/extensions */
import db, { Schema } from "../utils/database.js";

const Presentations = new Schema(
  {
    _id: String,
    title: String,
    ownerId: String,
    slides: [String]
  },
  { versionKey: false }
);

const Presentation = db.model("presentations", Presentations);
export default Presentation;
