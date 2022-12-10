/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import HashMap from "hashmap";
import EventModel from "./event.model.js";

const userConns = new HashMap();
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

  saveSocketConn(userId, socket) {
    if (socket !== userConns.get(userId)) {
      // const { room } = socket.request._query;
      // if (matchModel.isJoinSelfHostedPresentation(userId, room)) {
      //   socket.emit(
      //     EventModel.CLOSE_REASON,
      //     EventModel.REASON_HAS_NEW_CONNECTION
      //   );
      //   return false;
      // }
      if (userConns.get(userId)) {
        this.sendEvent(
          userId,
          EventModel.CLOSE_REASON,
          EventModel.REASON_HAS_NEW_CONNECTION
        );
        userConns.get(userId).disconnect(true);
        console.log("Kick old connection");
      }
      userConns.set(userId, socket);
      console.log(userConns.size);
    }
    return true;
  },

  removeSocketConn(userId) {
    if (userConns.get(userId)) {
      userConns.get(userId).disconnect(true);
      userConns.delete(userId);
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
