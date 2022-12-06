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

const router = express.Router();

async function isHasEditPermission(ownerId, presentationId, slideId) {
  const presentation = await PresentationModel.findByIdAndOwnerId(
    presentationId,
    ownerId
  );
  if (!presentation) {
    return null;
  }

  const slide = await SlideModel.findById(slideId, presentationId);
  if (!slide) {
    return null;
  }

  return {
    presentation,
    slide
  };
}

async function isReqValid(ownerId, presentationId, slideId) {
  if (!ownerId) {
    return {
      error: {
        status: 400,
        message: "Invalid access token"
      }
    };
  }

  if (
    !presentationId ||
    presentationId.toString().trim().length === 0 ||
    !slideId ||
    slideId.toString().trim().length === 0
  ) {
    return {
      error: {
        status: 400,
        message: "Invalid data"
      }
    };
  }

  const hasPermission = await isHasEditPermission(
    ownerId,
    presentationId,
    slideId
  );
  if (!hasPermission) {
    return {
      error: {
        status: 400,
        message: "You do not have this content"
      }
    };
  }

  return {
    error: null,
    slide: hasPermission.slide,
    presentation: hasPermission.presentation
  };
}

router.post("/create", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { presentationId, question, type, answers } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (!ownerId) {
    return res.json({
      status: 400,
      message: "Invalid access token"
    });
  }
  if (
    !presentationId ||
    presentationId.trim().length === 0 ||
    !question ||
    question.trim() === 0 ||
    !SlideModel.isTypeValid(type) ||
    (answers && answers.toString().trim().length === 0)
  ) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }

  const presentaion = await PresentationModel.findByIdAndOwnerId(
    presentationId,
    ownerId
  );
  if (!presentaion) {
    return res.json({
      status: 400,
      message: "You do not have this content"
    });
  }

  let answersJSArr = null;
  try {
    if (answers) {
      answersJSArr = JSON.parse(answers.toString());
    }
  } catch (err) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }

  const result = await SlideModel.create(
    ownerId,
    presentationId,
    type,
    question,
    answersJSArr
  );
  return res.json({
    status: 0,
    info: result
  });
});

router.post("/update", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { question, presentationId, slideId } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (!question || question.toString().trim().length === 0) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }

  const valid = await isReqValid(ownerId, presentationId, slideId);
  if (valid.error) {
    return res.json(valid.error);
  }

  const { slide } = valid;

  if (slide.question !== question.toString().trim()) {
    slide.question = question.toString().trim();
    SlideModel.save(slide);
  }
  return res.json({
    status: 0
  });
});

router.post("/delete", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { presentationId, slideId } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  const valid = await isReqValid(ownerId, presentationId, slideId);
  if (valid.error) {
    return res.json(valid.error);
  }

  SlideModel.delete(ownerId, slideId, presentationId);
  return res.json({
    status: 0
  });
});

router.post("/answer/create", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { presentationId, slideId, answer } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (!answer || answer.toString().trim().length === 0) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const valid = await isReqValid(ownerId, presentationId, slideId);
  if (valid.error) {
    return res.json(valid.error);
  }

  const result = await SlideModel.addAnswer(slideId, presentationId, answer);
  if (result) {
    return res.json({
      status: 0,
      info: result
    });
  }
  return res.json({
    status: 500,
    message: "Internal Server Error"
  });
});

router.post("/answer/update", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { presentationId, slideId, answerId, answer } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (
    !answer ||
    answer.toString().trim().length === 0 ||
    !answerId ||
    answerId.toString().trim().length === 0
  ) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const valid = await isReqValid(ownerId, presentationId, slideId);
  if (valid.error) {
    return res.json(valid.error);
  }

  const { slide } = valid;
  if (slide.answers && slide.answers.length > 0) {
    const index = slide.answers.findIndex(
      (answerTmp) => answerTmp._id === answerId
    );
    if (index !== -1) {
      if (slide.answers[index].des !== answer) {
        slide.answers[index].des = answer;
        SlideModel.save(slide);
      }
      return res.json({
        status: 0
      });
    }
  }
  return res.json({
    status: 400,
    message: "You do not have this content"
  });
});

router.post("/answer/delete", AuthenMw.stopWhenNotLogon, async (req, res) => {
  const { presentationId, slideId, answerId } = req.body;
  const ownerId = AuthenModel.getUidFromReq(req);
  if (!answerId || answerId.toString().trim().length === 0) {
    return res.json({
      status: 400,
      message: "Invalid data"
    });
  }
  const valid = await isReqValid(ownerId, presentationId, slideId);
  if (valid.error) {
    return res.json(valid.error);
  }

  const { slide } = valid;
  if (slide.answers && slide.answers.length > 0) {
    const index = slide.answers.findIndex(
      (answerTmp) => answerTmp._id === answerId
    );
    if (index !== -1) {
      slide.answers.splice(index, 1);
      SlideModel.save(slide);
      return res.json({
        status: 0
      });
    }
  }
  return res.json({
    status: 400,
    message: "You do not have this content"
  });
});

export default router;
