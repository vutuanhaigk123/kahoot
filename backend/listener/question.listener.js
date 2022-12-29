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
      if (!arg) {
        return;
      }
      console.log(arg);
      const data = MatchModel.doAsk(userId, name, room, arg.toString().trim());
      SocketModel.sendBroadcastRoom(
        userId,
        room,
        EventModel.RECEIVE_QUESTION_EVENT,
        { ...data, upVotes: 0 },
        ws
      );
    }
  });

  socket.on(EventModel.UPVOTE_QUESTION, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      if (!arg) {
        return;
      }
      console.log(arg);
      const result = MatchModel.doUpVoteQues(
        userId,
        room,
        arg.toString().trim()
      );
      if (result) {
        SocketModel.sendBroadcastRoom(
          userId,
          room,
          EventModel.RECEIVE_UPVOTE_QUESTION_EVENT,
          { id: arg.toString().trim(), isYou: false }
        );
        SocketModel.sendEvent(
          userId,
          EventModel.RECEIVE_UPVOTE_QUESTION_EVENT,
          {
            id: arg.toString().trim(),
            isYou: true
          }
        );
      }
    }
  });

  socket.on(EventModel.MARK_QUESTION_ANSWERED, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      if (!arg) {
        return;
      }
      const result = MatchModel.markQuesAnswered(
        userId,
        name,
        room,
        arg.toString().trim()
      );
      if (result) {
        SocketModel.sendBroadcastRoom(
          userId,
          room,
          EventModel.RECEIVE_MARK_QUES_ANSWERED_EVENT,
          arg.toString().trim(),
          ws
        );
      }
    }
  });
};
