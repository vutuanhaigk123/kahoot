/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Slide from "../schemas/slidesSchema.js";
import { getNewObjectId, SLIDE_TYPE } from "../utils/database.js";
import PresentationModel from "./presentation.model.js";

async function saveSlide(slide) {
  try {
    const ret = await slide.save();
    return ret;
  } catch (err) {
    console.log(err.code);
  }
  return null;
}

async function createMultipleChoiceSlide({
  id,
  presentationId,
  ownerId,
  question,
  answers
}) {
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
    type: SLIDE_TYPE.multiple_choice,
    question,
    content: null,
    answers: answersArr
  });

  const result = await saveSlide(slide);
  if (result) {
    PresentationModel.addSlide(ownerId, presentationId, id);
    return result;
  }
  return null;
}

async function createHeadingOrParagraphSlide({
  id,
  presentationId,
  ownerId,
  question,
  type,
  content
}) {
  const slide = new Slide({
    _id: id.toString(),
    presentationId,
    type,
    question,
    content,
    answers: null
  });
  const result = await saveSlide(slide);
  console.log(result);
  if (result) {
    PresentationModel.addSlide(ownerId, presentationId, id);
    return result;
  }
  return null;
}

export default {
  async findById(id, presentationId) {
    const ret = await Slide.findOne({ _id: id, presentationId }).exec();
    return ret;
  },

  isTypeValid(type) {
    switch (type.toString()) {
      case SLIDE_TYPE.multiple_choice.toString():
      case SLIDE_TYPE.heading.toString():
      case SLIDE_TYPE.paragraph.toString():
        return true;
      default:
        return false;
    }
  },

  async getSlidesByPresentationId(presentationId) {
    const ret = await Slide.find({ presentationId })
      .select(
        "_id question type answers._id answers.des answers.choiceUids content"
      )
      .exec();
    return ret;
  },

  async addChoiceUid(slideId, presentationId, answerId, choiceUid) {
    await Slide.updateOne(
      { _id: slideId, presentationId, "answers._id": answerId },
      { $push: { "answers.$.choiceUids": choiceUid } }
    );
  },

  async save(slide) {
    const res = await saveSlide(slide);
    return res;
  },

  async getSlides(slides) {
    const result = await Slide.find({
      _id: {
        $in: slides
      }
    }).exec();
    return result;
  },

  async create(ownerId, presentationId, type, question, answers, content) {
    const id = getNewObjectId();

    let res = null;
    switch (type.toString()) {
      case SLIDE_TYPE.multiple_choice.toString():
        res = await createMultipleChoiceSlide({
          id,
          presentationId,
          ownerId,
          type,
          question,
          answers
        });
        break;
      case SLIDE_TYPE.heading.toString():
      case SLIDE_TYPE.paragraph.toString():
        console.log("hitttt");
        {
          let contentTmp = content;
          if (!content) {
            contentTmp = null;
          }
          res = await createHeadingOrParagraphSlide({
            id,
            presentationId,
            ownerId,
            question,
            type,
            content: contentTmp
          });
        }
        break;
      default:
        break;
    }
    return res;
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
      { _id: slideId, presentationId, type: SLIDE_TYPE.multiple_choice },
      { $push: { answers: ans } }
    );
    if (result && result.modifiedCount === 1) {
      return ans;
    }
    return null;
  },

  async updateSubHeadingOrParagraph(slideId, presentationId, content) {
    const result = await Slide.updateOne(
      {
        _id: slideId,
        presentationId
      },
      { content }
    );
    if (result && result.modifiedCount === 1) {
      return true;
    }
    return false;
  }
};
