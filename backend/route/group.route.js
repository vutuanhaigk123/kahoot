/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import { parse } from "cookie";
import AuthenMw from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import CookieModel from "../model/cookie.model.js";
import EventModel from "../model/event.model.js";
import matchModel from "../model/match.model.js";
import SocketModel from "../model/socket.model.js";

function getUidFromWs(socket) {
  if (socket.handshake.headers.cookie) {
    const cookies = parse(socket.handshake.headers.cookie);
    return AuthenModel.getUidFromToken(cookies[CookieModel.ACCESS_TOKEN]);
  }
  return null;
}

let socketIns = null;

function sendIfHavePresenting(socket, presentationId) {
  if (socket && matchModel.isMatchExist(presentationId)) {
    socket.emit(EventModel.GROUP_RECEIVE_PRESENTING_EVENT, {
      presentationId
    });
  }
}

export default async (ws) => {
  socketIns = ws;
  // middleware: stop when not logged in
  ws.use((socket, next) => {
    AuthenMw.wsStopWhenNotLogon(socket, next);
  });

  ws.on("connection", async (socket) => {
    const userId = getUidFromWs(socket);

    let group = "";
    socket.on(EventModel.INIT_CONNECTION, async ({ groupId }) => {
      // middleware: stop when: invalid cmd || invalid room || invalid slide
      if (await AuthenMw.isStopWhenNotGroupMember(userId, groupId)) {
        socket.disconnect(true);
        return;
      }
      group = groupId;
      socket.join(groupId);
      sendIfHavePresenting(
        socket,
        matchModel.getPresentationIdByGroupId(groupId)
      );
    });

    socket.on("error", (err) => {
      console.log("error: ", err);
      SocketModel.removeSocketConn(userId);
    });

    socket.conn.on("close", (reason) => {
      if (group.length !== 0) {
        socket.leave(group);
      }
    });
  });
};

export const sendGroupNotiRealtime = (groupId, presentationId) => {
  if (socketIns) {
    socketIns
      .to(groupId)
      .emit(EventModel.GROUP_RECEIVE_PRESENTING_EVENT, { presentationId });
  }
};
