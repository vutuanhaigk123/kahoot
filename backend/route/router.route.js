/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import apiTest from "../api/test.api.js";
import apiAuth from "../api/authen.api.js";
import apiGroup from "../api/group.api.js";
import apiUser from "../api/user.api.js";
import apiPresentation from "../api/presentation.api.js";
import apiSlide from "../api/slide.api.js";

import authRoute from "./authen.route.js";
import matchRoute from "./match.route.js";
import groupRoute from "./group.route.js";

// const pathInfos = ["/about", "/test", "/test2", "*"];

export default (app, ws, __dirname) => {
  app.use("/login", authRoute);
  matchRoute(ws.of("/ws/match"));
  groupRoute(ws.of("/ws/group"));

  app.use("/api", apiTest);
  app.use("/api/authen/", apiAuth);
  app.use("/api/group", apiGroup);
  app.use("/api/user", apiUser);
  app.use("/api/presentation", apiPresentation);
  app.use("/api/slide", apiSlide);

  // Served react route

  // pathInfos.map((path) => {
  //   console.log(`init ${path}`);
  //   app.get(path, (req, res) => {
  //     return res.sendFile(`${__dirname}/build/index.html`);
  //   });
  // });
  app.get("/*", (req, res) => {
    return res.sendFile(`${__dirname}/build/index.html`);
  });
};
