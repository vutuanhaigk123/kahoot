/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
// import initMw from "./middleware/init.mw.js";
import router from "./route/router.route.js";
// import userModel from "./model/user.model.js";
// import presentationModel from "./model/presentation.model.js";

const dirNamePath = dirname(fileURLToPath(import.meta.url));

const app = express();
// const count = 0;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${dirNamePath}/build`));

const port = process.env.PORT || 3001;

const httpServer = createServer(app);
const ws = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true
  }
});
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// initMw(app);
router(app, ws, dirNamePath);

// console.log(
//   await presentationModel.addCollaborator(
//     "6377b6636c13318921bd9863",
//     "638b23ef95e572e6e5b6e7fb",
//     "637632b8b0d122858cb9b1f8"
//   )
// );

// console.log(
//   await presentationModel.getAllByCollaborator("6373a7da2ed8b26d6bd97dff")
// );

// console.log(
//   await userModel.multiGetShortInfoByIds([
//     "6373a7da2ed8b26d6bd97dff",
//     "6374f94cba8fa051441918e6"
//   ])
// );
