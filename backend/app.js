/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import initMw from "./middleware/init.mw.js";
import router from "./route/router.route.js";

const dirNamePath = dirname(fileURLToPath(import.meta.url));

const app = express();
// const count = 0;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${dirNamePath}/build`));

const port = process.env.PORT || 3001;

initMw(app);
router(app, dirNamePath);

// const ret = await GroupModel.filterEmailsNotInGroup(
//   ["vutuanhaigk@gmail.com", "vutuanhaigk123@gmail.comm"],
//   "6377bb653cd0cef0e9057104"
// );
// console.log(ret);

// const resMap = await GroupModel.getMemberIdsInGroup([
//   "6377b6636c13318921bd9863",
//   "6377b6636c13318921bd9864"
// ]);
// console.log(resMap);
// console.log(resMap.get("6377b6636c13318921bd9863"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
