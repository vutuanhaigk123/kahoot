/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import express from "express";
import passport from "passport";
import AuthenMw from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import matchModel from "../model/match.model.js";
import PresentationModel from "../model/presentation.model.js";
import SlideModel from "../model/slide.model.js";
import UserModel from "../model/user.model.js";
import { SLIDE_TYPE } from "../utils/database.js";

const router = express.Router();

function isReqValid(title, ownerId) {
  if (!ownerId) {
    return {
      status: 400,
      message: "Invalid access token"
    };
  }
  if (!title || title.trim().length === 0) {
    return {
      status: 400,
      message: "Invalid fields"
    };
  }
  return null;
}

router.post(
  "/add-colab",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { presentationId, email } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    const isValid = isReqValid(email, ownerId);
    if (isValid !== null) {
      return res.json(isValid);
    }
    if (!presentationId || presentationId.trim().length === 0) {
      return {
        status: 400,
        message: "Invalid fields"
      };
    }

    const user = await UserModel.findByEmail(email.trim());
    if (!user) {
      return res.json({
        status: 404,
        message: "This email does not belong to any user in system"
      });
    }

    if (user._id === ownerId) {
      return res.json({
        status: 403,
        message: "You can not invite yourself as collaborator"
      });
    }

    const result = await PresentationModel.addCollaborator(
      ownerId,
      presentationId,
      user._id
    );
    if (result.modifiedCount > 0) {
      return res.json({ status: 0 });
    }
    return res.json({
      status: 405,
      message: "Already exist this collaborator"
    });
  }
);

router.post(
  "/del-colab",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { presentationId, collaboratorId } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    const isValid = isReqValid(collaboratorId, ownerId);
    if (isValid !== null) {
      return res.json(isValid);
    }
    if (!presentationId || presentationId.trim().length === 0) {
      return {
        status: 400,
        message: "Invalid fields"
      };
    }

    // remove async
    PresentationModel.deleteCollaborator(
      ownerId,
      presentationId,
      collaboratorId
    );
    return res.json({
      status: 0
    });
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { title } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    const isValid = isReqValid(title, ownerId);
    if (isValid !== null) {
      return res.json(isValid);
    }
    const result = await PresentationModel.create(title, ownerId);
    if (!result) {
      return res.json({
        status: 500,
        message: "Internal error"
      });
    }
    return res.json({
      status: 0,
      info: result
    });
  }
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { title, presentationId } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    const isValid = isReqValid(title, ownerId);
    if (isValid !== null) {
      return res.json(isValid);
    }
    if (!presentationId || presentationId.trim().length === 0) {
      return res.json({
        status: 400,
        message: "Invalid fields"
      });
    }

    const presentation = await PresentationModel.findById(presentationId);
    // const presentation = await PresentationModel.findByIdAndOwnerId(
    //   presentationId,
    //   ownerId
    // );
    if (
      !presentation ||
      (presentation.ownerId !== ownerId &&
        presentation.collaborators &&
        !presentation.collaborators.includes(ownerId))
    ) {
      return res.json({
        status: 404,
        message: "Not found presentationId"
      });
    }

    if (title.trim() !== presentation.title) {
      presentation.title = title.trim();
      PresentationModel.save(presentation);
    }

    return res.json({
      status: 0
    });
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { presentationId } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);

    if (!presentationId || presentationId.trim().length === 0) {
      return res.json({
        status: 400,
        message: "Invalid fields"
      });
    }

    const presentation = await PresentationModel.findByIdAndOwnerId(
      presentationId,
      ownerId
    );
    if (!presentation) {
      return res.json({
        status: 404,
        message: "Not found presentationId"
      });
    }

    if (matchModel.isMatchExist(presentationId)) {
      return res.json({
        status: 400,
        message: "You can not delete a living presentation"
      });
    }

    PresentationModel.delete(ownerId, presentationId, presentation.slides);

    return res.json({
      status: 0
    });
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const ownerId = AuthenModel.getUidFromReq(req);
    if (!ownerId) {
      return {
        status: 400,
        message: "Invalid access token"
      };
    }
    const presentation = await PresentationModel.getAllByOwnerId(ownerId);
    return res.json({
      status: 0,
      info: presentation
    });
  }
);

router.get(
  "/colab",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const ownerId = AuthenModel.getUidFromReq(req);
    if (!ownerId) {
      return {
        status: 400,
        message: "Invalid access token"
      };
    }
    const presentation = await PresentationModel.getAllByCollaborator(ownerId);
    return res.json({
      status: 0,
      info: presentation
    });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const presentationId = req.params.id;
    const ownerId = AuthenModel.getUidFromReq(req);
    if (!ownerId) {
      return {
        status: 400,
        message: "Invalid access token"
      };
    }
    const presentation = await PresentationModel.findById(presentationId);
    // const presentation = await PresentationModel.findByIdAndOwnerId(
    //   presentationId,
    //   ownerId
    // );
    if (
      !presentation ||
      (presentation.ownerId !== ownerId &&
        presentation.collaborators &&
        !presentation.collaborators.includes(ownerId))
    ) {
      return res.json({
        status: 404,
        message: "You do not have this content"
      });
    }
    const slides = await SlideModel.getSlides(presentation.slides);
    const slidesRes = [];
    slides.forEach((slide) => {
      if (slide.type.toString() === SLIDE_TYPE.multiple_choice.toString()) {
        const answersRes = [];
        slide.answers.forEach((answer) => {
          const ansTmp = {
            _id: answer._id,
            des: answer.des,
            total: answer.choiceUids.length
          };
          answersRes.push(ansTmp);
          if (presentation.ownerId === ownerId) {
            ansTmp.choiceUserInfo = answer.choiceUids;
          }
        });
        slidesRes.push({
          _id: slide._id,
          question: slide.question,
          type: slide.type,
          answers: answersRes
        });
      } else {
        const slideTmp = {
          _id: slide._id,
          question: slide.question,
          type: slide.type
        };
        slidesRes.push(slideTmp);
        if (slide.type.toString() === SLIDE_TYPE.heading.toString()) {
          slideTmp.heading = slide.content;
        } else {
          slideTmp.paragraph = slide.content;
        }
      }
    });

    const collaborators = [];
    const userMap = await UserModel.multiGetShortInfoByIds(
      presentation.collaborators
    );
    if (userMap) {
      presentation.collaborators.forEach((collaboratorId) => {
        const { name, email } = userMap.get(collaboratorId);
        collaborators.push({
          id: collaboratorId,
          name,
          email
        });
      });
    }

    const info = {
      _id: presentation._id,
      title: presentation.title,
      slides: slidesRes,
      isOwner: presentation.ownerId === ownerId
    };
    if (presentation.ownerId === ownerId) {
      info.collaborators = collaborators;
      const userShortInfoList =
        await PresentationModel.getShortUserInfoSubmittedChoice(slides);
      if (userShortInfoList) {
        info.userShortInfoList = userShortInfoList;
      }
    }
    return res.json({
      status: 0,
      info
    });
  }
);

export default router;
