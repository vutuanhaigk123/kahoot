/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Slide from "../schemas/slidesSchema.js";
import { getNewObjectId, SLIDE_TYPE } from "../utils/database.js";
import PresentationModel from "./presentation.model.js";

export default {
  async findById(id, presentationId) {
    const ret = await Slide.findOne({ _id: id, presentationId }).exec();
    return ret;
  },

  isTypeValid(type) {
    switch (type.toString()) {
      case SLIDE_TYPE.multiple_choice.toString():
        return true;
      default:
        return false;
    }
  },

  async getSlidesByPresentationId(presentationId) {
    const ret = await Slide.find({ presentationId })
      .select("_id question type answers._id answers.des")
      .exec();
    return ret;
  },

  async save(slide) {
    try {
      const ret = await slide.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async getSlides(slides) {
    const result = await Slide.find({
      _id: {
        $in: slides
      }
    }).exec();
    return result;
  },

  async create(ownerId, presentationId, type, question, answers) {
    const id = getNewObjectId();

    const answersArr = [];
    if (answers) {
      answers.forEach((answer) => {
        answersArr.push({
          _id: getNewObjectId().toString(),
          des: answer,
          choiceUids: []
        });
      });
    }

    const slide = new Slide({
      _id: id.toString(),
      presentationId,
      type,
      question,
      answers: answersArr
    });

    const result = await this.save(slide);
    if (result) {
      PresentationModel.addSlide(ownerId, presentationId, id);
      return result;
    }
    return null;
  },

  async delete(ownerId, slideId, presentationId) {
    const res = await Slide.deleteOne({ _id: slideId, presentationId }).exec();
    if (res && res.deletedCount === 1) {
      PresentationModel.deleteSlide(ownerId, presentationId, slideId);
      return res;
    }
    return null;
  },

  async deleteSlides(slideIds) {
    const res = await Slide.deleteMany({ _id: { $in: slideIds } }).exec();
    if (res && res.deletedCount !== 0) {
      return res.deletedCount;
    }
    return 0;
  },

  async addAnswer(slideId, presentationId, answer) {
    const ans = {
      _id: getNewObjectId().toHexString(),
      des: answer,
      choiceUids: []
    };
    const result = await Slide.updateOne(
      { _id: slideId, presentationId },
      { $push: { answers: ans } }
    );
    if (result && result.modifiedCount === 1) {
      return ans;
    }
    return null;
  }
};
