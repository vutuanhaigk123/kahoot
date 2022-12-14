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
import PresentationModel from "../model/presentation.model.js";
import MatchModel from "../model/match.model.js";
import AuthenMw from "../middleware/authen.mw.js";
import slideModel from "../model/slide.model.js";
import presentationListerner from "../listener/presentation.listerner.js";
import questionListener from "../listener/question.listener.js";
import commentListener from "../listener/comment.listener.js";
import userModel from "../model/user.model.js";

const matchingQueue = [];

function getUidFromWs(socket) {
  if (socket.handshake.headers.cookie) {
    const cookies = parse(socket.handshake.headers.cookie);
    return AuthenModel.getUidFromToken(cookies[CookieModel.ACCESS_TOKEN]);
  }
  return null;
}

function initConnection(socket, room) {
  const userId = getUidFromWs(socket);
  console.log(userId);
  if (!userId) {
    return false;
  }
  if (!SocketModel.saveSocketConn(userId, room, socket)) {
    return false;
  }
  return true;
}

async function hasContent(userId, room, slide) {
  if (!room || !slide) {
    return null;
  }
  const presentation = await PresentationModel.findByIdAndOwnerId(room, userId);
  if (!presentation) {
    return null;
  }

  const slideRes = await slideModel.findById(slide, room);
  if (!slideRes) {
    return null;
  }
  return { presentation, slide: slideRes };
}

function sendUnknownCommand(userId) {
  SocketModel.sendEvent(
    userId,
    EventModel.CLOSE_REASON,
    EventModel.REASON_INVALID_CMD
  );
  return SocketModel.removeSocketConn(userId);
}

async function sendDataToOwner(socket, userId, room, slide) {
  if (!(await hasContent(userId, room, slide))) {
    // send have no present permission
    SocketModel.sendEvent(
      userId,
      EventModel.CLOSE_REASON,
      EventModel.REASON_NOT_FOUND_CONTENT
    );

    SocketModel.removeSocketConn(userId);
    return;
  }
  // join or create room
  const result = await MatchModel.joinMatch(userId, true, room, slide);
  if (result) {
    const { curState, curQues, data, joinedUser, isEnd, isFirst } = result;

    if (curQues) {
      SocketModel.sendEvent(userId, EventModel.INIT_CONNECTION, {
        curState,
        curQues,
        isEnd,
        isFirst
        // data
      });
      socket.join(room);
      return;
    }
    SocketModel.sendEvent(
      userId,
      EventModel.CLOSE_REASON,
      EventModel.REASON_SLIDE_HAS_NO_ANS
    );
    SocketModel.removeSocketConn(userId);
    return;

    // send broadcast when new user joined lobby (for lobby mode)
    // if (curState === MatchModel.STATE_LOBBY && joinedUser) {
    //   SocketModel.sendBroadcastRoom(
    //     userId,
    //     room,
    //     EventModel.JOIN_ROOM,
    //     joinedUser
    //   );
    //   return;
    // }
  }
  SocketModel.removeSocketConn(userId);
}

async function sendDataToPlayer(socket, userId, room, slide) {
  // join or create room
  const result = await MatchModel.joinMatch(userId, false, room, slide);
  // console.log(result);
  if (result) {
    const { curState, curQues, data, joinedUser } = result;
    if (curQues) {
      SocketModel.sendEvent(userId, EventModel.INIT_CONNECTION, {
        curState,
        curQues
        // data
      });
      socket.join(room);
      return;
    }

    // send broadcast when new user joined lobby (for lobby mode)
    // if (curState === MatchModel.STATE_LOBBY && joinedUser) {
    //   SocketModel.sendBroadcastRoom(
    //     userId,
    //     room,
    //     EventModel.JOIN_ROOM,
    //     joinedUser
    //   );
    //   return;
    // }
  }
  SocketModel.removeSocketConn(userId);
}

async function sendInitData(socket, room, cmd, slide) {
  const userId = getUidFromWs(socket);

  switch (cmd) {
    case EventModel.CREATE_ROOM:
      await sendDataToOwner(socket, userId, room, slide);
      break;
    case EventModel.JOIN_ROOM:
      await sendDataToPlayer(socket, userId, room, slide);
      break;
    default: // disconnect here
      sendUnknownCommand(userId);
      break;
  }

  // // check user has content (to present) or not (vote in present)
  // if (cmd === EventModel.CREATE_ROOM && !(await hasContent(socket))) {
  //   // TODO: send have no present permission
  //   SocketModel.sendEvent(
  //     userId,
  //     EventModel.CLOSE_REASON,
  //     EventModel.REASON_NOT_FOUND_CONTENT
  //   );

  //   return SocketModel.removeSocketConn(userId);
  // }

  // // join or create room
  // const result = await MatchModel.joinMatch(userId, room);
  // if (result) {
  //   const { curState, curQues, data, joinedUser } = result;
  //   SocketModel.sendEvent(userId, EventModel.INIT_CONNECTION, {
  //     curState,
  //     curQues
  //     // data
  //   });
  //   socket.join(room);
  //   if (curState === MatchModel.STATE_LOBBY && joinedUser) {
  //     return SocketModel.sendBroadcastRoom(
  //       userId,
  //       room,
  //       EventModel.JOIN_ROOM,
  //       joinedUser
  //     );
  //   }
  //   // prevent removeSocketConn
  //   return true;
  // }
  // return SocketModel.removeSocketConn(userId);
}

export default async (path, ws) => {
  // middleware: stop when not logged in
  ws.use((socket, next) => {
    AuthenMw.wsStopWhenNotLogon(socket, next);
  });

  ws.on("connection", async (socket) => {
    const userId = getUidFromWs(socket);
    let roomId = null;
    let cmdId = null;
    let slideId = null;

    socket.on(EventModel.INIT_CONNECTION, async ({ cmd, slide, room }) => {
      // middleware: stop when: invalid cmd || invalid room || invalid slide
      if (await AuthenMw.isStopWhenInvalidQuery(cmd, slide, room)) {
        socket.emit(EventModel.CLOSE_REASON, EventModel.REASON_INVALID_CMD);
        socket.disconnect(true);
        return;
      }
      roomId = room;
      cmdId = cmd;
      slideId = slide;

      if (!initConnection(socket, room)) {
        socket.disconnect(true);
      }

      console.log("Connected");

      await sendInitData(socket, room, cmdId, slideId);

      const { name, avt } = await userModel.getNameAndAvt(userId);

      presentationListerner(ws, socket, userId, cmdId, roomId, slideId);
      questionListener(ws, socket, userId, name, avt, cmdId, roomId, slideId);
      commentListener(ws, socket, userId, name, avt, cmdId, roomId, slideId);
    });

    socket.on("error", (err) => {
      SocketModel.removeSocketConn(userId);
    });

    socket.conn.on("close", (reason) => {
      socket.leave(roomId);
      MatchModel.leaveLobby(userId, roomId, ws);
      SocketModel.removeSocketConn(userId);
      console.log("closed");
    });
  });
};
