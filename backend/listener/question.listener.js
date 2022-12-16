/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";
import SocketModel from "../model/socket.model.js";

const removeQuestionListener = (socket) => {
  socket.removeAllListeners(EventModel.SEND_QUESTION);
};

export default async (ws, socket, userId, name, avt, cmd, room, slide) => {
  removeQuestionListener(socket);

  socket.on(EventModel.SEND_QUESTION, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      console.log(arg);
      const data = MatchModel.doAsk(userId, name, room, arg);
      SocketModel.sendBroadcastRoom(
        userId,
        room,
        EventModel.RECEIVE_QUESTION_EVENT,
        data,
        ws
      );
    }
  });
};
