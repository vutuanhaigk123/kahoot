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
