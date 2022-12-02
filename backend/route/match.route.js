/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import appWs from "express-ws";
import HashMap from "hashmap";
import { parse } from "cookie";
import SocketModel from "../model/socket.model.js";
import AuthenModel from "../model/authen.model.js";
import CookieModel from "../model/cookie.model.js";
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";
import AuthenMw from "../middleware/authen.mw.js";

const matchingQueue = [];

function getUidFromWs(socket) {
  if (socket.handshake.headers.cookie) {
    const cookies = parse(socket.handshake.headers.cookie);
    return AuthenModel.getUidFromToken(cookies[CookieModel.ACCESS_TOKEN]);
  }
  return null;
}

function initConnection(socket) {
  const userId = getUidFromWs(socket);
  console.log(userId);
  if (!userId) {
    return false;
  }
  SocketModel.saveSocketConn(userId, socket);
  return true;
}

async function sendInitData(socket) {
  // join or create room
  const { room, cmd } = socket.request._query;
  const userId = getUidFromWs(socket);
  const result = await MatchModel.joinMatch(userId, room);
  if (result) {
    const { curState, curQues, data, joinedUser } = result;
    SocketModel.sendEvent(userId, EventModel.INIT_CONNECTION, {
      curState,
      curQues,
      data
    });
    socket.join(room);
    if (curState === MatchModel.STATE_LOBBY && joinedUser) {
      SocketModel.sendBroadcastRoom(
        userId,
        room,
        EventModel.JOIN_ROOM,
        joinedUser
      );
    }
  } else {
    SocketModel.removeSocketConn(userId);
  }
}

export default async (path, ws) => {
  // middleware: stop when not logged in
  ws.use((socket, next) => {
    AuthenMw.wsStopWhenNotLogon(socket, next);
  });

  // middleware: stop when: invalid cmd || invalid room
  ws.use(async (socket, next) => {
    AuthenMw.wsStopWhenInvalidQuery(socket, next);
  });

  ws.on("connection", async (socket) => {
    if (!initConnection(socket)) {
      socket.disconnect(true);
    }

    console.log("Connected");

    await sendInitData(socket);

    const { room } = socket.request._query;
    const userId = getUidFromWs(socket);

    socket.on(EventModel.SUBMIT_CHOICE, (arg) => {
      console.log(arg);
      MatchModel.makeChoice(userId, room, "question1", arg, ws);
    });

    socket.on("error", (err) => {
      SocketModel.removeSocketConn(getUidFromWs(socket));
    });

    socket.conn.on("close", (reason) => {
      socket.leave(room);
      MatchModel.leaveLobby(userId, room, ws);
      SocketModel.removeSocketConn(userId);
      console.log("closed");
    });
  });
};
