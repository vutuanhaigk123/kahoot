/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Presentation from "../schemas/presentationsSchema.js";
import { getNewObjectId } from "../utils/database.js";

export default {
  async findById(id) {
    const ret = await Presentation.findById({ _id: id }).exec();
    return ret;
  },

  async findByIdAndOwnerId(id, ownerId) {
    const ret = await Presentation.findById({
      _id: id,
      ownerId
    }).exec();
    return ret;
  },

  async getAllByOwnerId(ownerId) {
    const ret = await Presentation.find({ ownerId }).select("_id title").exec();
    return ret;
  },

  async save(presentation) {
    try {
      const ret = await presentation.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async create(title, ownerId) {
    const id = getNewObjectId();
    const presentation = new Presentation({
      _id: id.toString(),
      title,
      ownerId,
      slides: []
    });
    const result = await this.save(presentation);
    return result;
  }
};
