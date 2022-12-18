/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import express from "express";
import AuthenMw from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import PresentationModel from "../model/presentation.model.js";
import SlideModel from "../model/slide.model.js";
import UserModel from "../model/user.model.js";

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

router.post("/add-colab", AuthenMw.stopWhenNotLogon, async (req, res) => {
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
  return res.json({ status: 405, message: "Already exist this collaborator" });
});

router.post("/del-colab", AuthenMw.stopWhenNotLogon, async (req, res) => {
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
  PresentationModel.deleteCollaborator(ownerId, presentationId, collaboratorId);
  return res.json({
    status: 0
  });
});

router.post("/create", AuthenMw.stopWhenNotLogon, async (req, res) => {
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
});

router.post("/update", async (req, res) => {
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

  if (title.trim() !== presentation.title) {
    presentation.title = title.trim();
    PresentationModel.save(presentation);
  }

  return res.json({
    status: 0
  });
});

router.post("/delete", async (req, res) => {
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

  PresentationModel.delete(ownerId, presentationId, presentation.slides);

  return res.json({
    status: 0
  });
});

router.get("/", AuthenMw.stopWhenNotLogon, async (req, res) => {
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
});

router.get("/colab", AuthenMw.stopWhenNotLogon, async (req, res) => {
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
});

router.get("/:id", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const presentationId = req.params.id;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (!ownerId) {
    return {
      status: 400,
      message: "Invalid access token"
    };
  }
  const presentation = await PresentationModel.findByIdAndOwnerId(
    presentationId,
    ownerId
  );
  if (!presentation) {
    return res.json({
      status: 404,
      message: "You do not have this content"
    });
  }
  const slides = await SlideModel.getSlides(presentation.slides);
  const slidesRes = [];
  slides.forEach((slide) => {
    const answersRes = [];
    slide.answers.forEach((answer) => {
      answersRes.push({
        _id: answer._id,
        des: answer.des,
        total: answer.choiceUids.length
      });
    });
    slidesRes.push({
      _id: slide._id,
      question: slide.question,
      type: slide.type,
      answers: answersRes
    });
  });

  return res.json({
    status: 0,
    info: {
      _id: presentation._id,
      title: presentation.title,
      slides: slidesRes
    }
  });
});

export default router;
