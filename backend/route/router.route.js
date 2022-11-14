/* eslint-disable import/extensions */
import apiTest from "../api/test.api.js";
import apiAuth from "../api/authen.api.js";
import AuthenMW from "../middleware/authen.mw.js";

import authRoute from "./authen.route.js";
import matchRoute from "./match.route.js";

const pathInfos = ["/about", "/test", "/test2", "*"];

export default (app, __dirname) => {
  app.get("/a", AuthenMW.stopWhenNotLogon, (req, res) => {
    // eslint-disable-next-line no-console
    console.log(req.session);
    return res.json({
      code: 200,
      message: "OK"
    });
  });

  // app.get(
  //     "/login/facebook",
  //     passport.authenticate("facebook", { scope: ["email"] })
  // );

  app.use("/login", authRoute);
  matchRoute("/match", app);

  app.use("/api", apiTest);
  app.use("/api/authen/", apiAuth);

  // Served react route
  // eslint-disable-next-line array-callback-return
  pathInfos.map((path) => {
    // eslint-disable-next-line no-console
    console.log(`init ${path}`);
    app.get(path, (req, res) => {
      return res.sendFile(`${__dirname}/build/index.html`);
    });
  });
};
