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
import initMw from "./middleware/init.mw.js";
import router from "./route/router.route.js";
import env from "./utils/env.js";

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
    origin: env.DOMAIN,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true
  }
});
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

initMw(app);
router(app, ws, dirNamePath);
