/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";
import SocketModel from "../model/socket.model.js";

export default async (ws, socket, userId, name, avt, cmd, room, slide) => {
  socket.on(EventModel.SEND_QUESTION, (arg) => {
    console.log(arg);
    SocketModel.sendBroadcastRoom(
      userId,
      room,
      EventModel.RECEIVE_QUESTION_EVENT,
      { senderId: userId, senderName: name, data: arg },
      ws
    );
  });
};
