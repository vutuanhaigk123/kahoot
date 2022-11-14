/* eslint-disable no-console */
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import jwt from "jsonwebtoken";
// import env from "./utils/env.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import initMw from "./middleware/init.mw";
import router from "./route/router.route";

const dirNamePath = dirname(fileURLToPath(import.meta.url));

const app = express();
// const count = 0;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static(`${dirNamePath}/build`));

const port = process.env.PORT || 3001;

initMw(app);
router(app, dirNamePath);

// console.log(
//     jwt.sign({ a: "b" }, env.SECRET_APP, {
//         expiresIn: "7d",
//     })
// );

// try {
//     console.log(
//         jwt.verify(
//             // jwt.sign({ a: "b" }, env.SECRET_APP, {
//             //     expiresIn: "2d",
//             // }),
//             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjAsImlhdCI6MTY2NjE1MzAzNiwiZXhwIjoxNjY2MTUzMDk2fQ.gTNu_0rvRF9iX2uf8a6QOoQziGe2ooLIMck7oBA2IuI",
//             env.SECRET_APP
//         )
//     );
// } catch (err) {
//     switch (err.name) {
//         case "TokenExpiredError":
//             console.log("use refresh token");
//             break;
//         default:
//             console.log(err);
//     }
// }

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
