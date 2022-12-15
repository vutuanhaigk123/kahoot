/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";
import SocketModel from "../model/socket.model.js";

const removeCommentListener = (socket) => {
  socket.removeAllListeners(EventModel.SEND_CMT);
};

export default async (ws, socket, userId, name, avt, cmd, room, slide) => {
  removeCommentListener(socket);

  if (SocketModel.isAuthorized(userId, room)) {
    socket.on(EventModel.SEND_CMT, (arg) => {
      console.log(arg);
      const data = MatchModel.doComment(userId, name, room, arg);
      SocketModel.sendBroadcastRoom(
        userId,
        room,
        EventModel.RECEIVE_CMT_EVENT,
        data,
        ws
      );
    });
  }
};
