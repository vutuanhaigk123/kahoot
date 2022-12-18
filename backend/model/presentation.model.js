/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Presentation from "../schemas/presentationsSchema.js";
import { getNewObjectId } from "../utils/database.js";
import SlideModel from "./slide.model.js";
import userModel from "./user.model.js";

export default {
  async findById(id) {
    const ret = await Presentation.findById({ _id: id }).exec();
    return ret;
  },

  async findByIdAndOwnerId(id, ownerId) {
    const ret = await Presentation.findOne({
      _id: id,
      ownerId
    }).exec();
    return ret;
  },

  async getAllByOwnerId(ownerId) {
    const ret = await Presentation.find({ ownerId }).select("_id title").exec();
    return ret;
  },

  async getAllByCollaboratorId(collaboratorId) {
    const ret = await Presentation.find({ collaborators: collaboratorId })
      .select("_id title ownerId")
      .exec();
    return ret;
  },

  async getAllByCollaborator(collaboratorId) {
    const ret = await this.getAllByCollaboratorId(collaboratorId);
    if (ret.length !== 0) {
      const ownerIds = [];
      const result = [];
      ret.forEach((presentation) => {
        result.push({
          id: presentation._id.toString(),
          title: presentation.title,
          ownerId: presentation.ownerId
        });
        ownerIds.push(presentation.ownerId);
      });

      const userMap = await userModel.multiGetShortInfoByIds(ownerIds);
      if (!userMap) {
        return ret;
      }

      for (let i = 0; i < result.length; i++) {
        const presentation = result[i];
        presentation.ownerName = userMap.get(presentation.ownerId);
      }
      return result;
    }
    return ret;
  },

  async addCollaborator(ownerId, presentationId, collaboratorId) {
    const result = await Presentation.updateOne(
      {
        _id: presentationId,
        ownerId,
        collaborators: { $not: { $all: [collaboratorId] } }
      },
      { $push: { collaborators: collaboratorId } }
    );
    return result;
  },

  async deleteCollaborator(ownerId, presentationId, collaboratorId) {
    const result = await Presentation.updateOne(
      { _id: presentationId, ownerId },
      { $pull: { collaborators: collaboratorId } }
    );
    return result;
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
      collaborators: [],
      slides: []
    });
    const result = await this.save(presentation);
    return result;
  },

  async delete(ownerId, presentationId, slideIds) {
    const res = await Presentation.deleteOne({
      _id: presentationId,
      ownerId
    }).exec();
    if (res && res.deletedCount === 1) {
      SlideModel.deleteSlides(slideIds);
      return true;
    }
    return false;
  },

  async addSlide(ownerId, presentationId, slideId) {
    const result = await Presentation.updateOne(
      { _id: presentationId, ownerId },
      { $push: { slides: slideId } }
    );
    return result;
  },

  async deleteSlide(ownerId, presentationId, slideId) {
    const result = await Presentation.updateOne(
      { _id: presentationId, ownerId },
      { $pull: { slides: slideId } }
    );
    return result;
  }
};
