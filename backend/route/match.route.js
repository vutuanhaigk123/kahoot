/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import appWs from "express-ws";
import EvModel from "../model/event.model.js";
import SocketModel from "../model/socket.model.js";

const userConns = {};
/*
    Structure: allow only one connection per user
    userConns = {
        userId: websocket connection
    }
*/

const matchingQueue = [];

async function stopWhenNotLogon(ws, req, next) {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    return next();
  }
  return ws.terminate();
}

function initConnection(ws, req) {
  const userId = 1;
  console.log(Object.keys(userConns).length);
  if (typeof userConns[`${userId}`] === "undefined") {
    // Init new connection
    console.log("init");
    userConns[`${userId}`] = {};
  } else {
    // Send KICK_CODE to old connection
    console.log("kick");
    userConns[`${userId}`].ws.terminate();
    SocketModel.sendMsg(
      userConns[`${userId}`],
      EvModel.build_KICK_CODE_packet()
    );
  }
  userConns[`${userId}`].ws = ws;
}

export default async (path, appBase) => {
  const wsInstance = appWs(appBase);
  const { app } = wsInstance;

  app.ws(
    path,
    // eslint-disable-next-line spaced-comment
    /*stopWhenNotLogon,*/ async (ws, req) => {
      initConnection(ws, req);

      ws.on("message", async (message) => {
        console.log(JSON.parse(message));
        console.log(Object.keys(userConns).length);
        ws.send("received");
      });

      ws.on("close", () => {
        // const userId = req.session.passport.user._id;
        const userId = 1;
        console.log("closed");
        delete userConns[`${userId}`];
      });
    }
  );
};
