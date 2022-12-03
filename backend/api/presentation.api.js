/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import express from "express";
import AuthenMw from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import PresentationModel from "../model/presentation.model.js";

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

export default router;
