/* eslint-disable no-console */
import HashMap from "hashmap";

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
    if (userConns.get(userId)) {
      userConns.get(userId).disconnect(true);
      console.log("Kick old connection");
    }
    userConns.set(userId, socket);
    console.log(userConns.size);
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
