/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import express from "express";

const router = express.Router();

let count = 0;

router.get("/test", (req, res) => {
  count += 1;
  res.json({
    code: 200,
    status: "OK",
    message: `Welcome visitor ${count}`
  });
});

export default router;
