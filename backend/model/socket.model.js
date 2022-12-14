/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import HashMap from "hashmap";
import EventModel from "./event.model.js";
import MatchModel from "./match.model.js";

const userConns = new HashMap();
const userPresentations = new HashMap();
/*
    Structure: allow only one connection per user
    userConns = {
        userId: websocket connection
    }
*/

export default {
  getSocketConn(userId) {
    return userConns.get(userId);
  },

  getPresentationByUserId(userId) {
    return userPresentations.get(userId);
  },

  isAuthorized(userId, room) {
    const oldRoom = userPresentations.get(userId);
    return oldRoom === room;
  },

  saveSocketConn(userId, room, cmd, socket) {
    if (socket !== userConns.get(userId)) {
      // if (
      //   cmd === EventModel.JOIN_ROOM &&
      //   MatchModel.isJoinSelfHostedPresentation(userId, room)
      // ) {
      //   socket.emit(
      //     EventModel.CLOSE_REASON,
      //     EventModel.REASON_SELF_HOSTED_PRESENTATION
      //   );
      //   return false;
      // }
      const oldConn = userConns.get(userId);
      if (oldConn) {
        oldConn.emit(
          EventModel.CLOSE_REASON,
          EventModel.REASON_HAS_NEW_CONNECTION
        );
        oldConn.disconnect(true);
        console.log("Kick old connection");
      }
      userConns.set(userId, socket);
      userPresentations.set(userId, room);
      console.log(userConns.size);
    } else {
      const oldRoom = userPresentations.get(userId);
      if (oldRoom !== room) {
        // send broadcast event "auto close presentation after n minutes because host is disconnected"
        socket.leave(oldRoom);
        MatchModel.timeoutDeleteMatch(userId, oldRoom, 0); // delete old room immediately
        userPresentations.set(userId, room);
      }
    }
    return true;
  },

  removeSocketConn(userId) {
    if (userConns.get(userId)) {
      userConns.get(userId).disconnect(true);
      userConns.delete(userId);
    }
  },

  removeSocketConnIfNotStored(userId, socket) {
    const storedSocket = userConns.get(userId);
    if (storedSocket !== socket) {
      socket.disconnect(true);
    } else if (storedSocket) {
      this.removeSocketConn(userId);
    }
  },

  sendEvent(userId, event, data) {
    if (userConns.get(userId)) {
      userConns.get(userId).emit(event, data);
    }
  },

  sendBroadcastRoom(userId, room, event, data, ws = null) {
    if (userConns.get(userId)) {
      if (ws) {
        ws.to(room).emit(event, data);
      } else {
        userConns.get(userId).to(room).emit(event, data);
      }
    }
  }
};
