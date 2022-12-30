/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";
import SocketModel from "../model/socket.model.js";

const removePresentationListener = (socket) => {
  socket.removeAllListeners(EventModel.SUBMIT_CHOICE);
  socket.removeAllListeners(EventModel.NEXT_SLIDE);
  socket.removeAllListeners(EventModel.PREV_SLIDE);
};

export default async (
  ws,
  socket,
  userId,
  name,
  avt,
  email,
  cmd,
  room,
  slide
) => {
  removePresentationListener(socket);

  socket.on(EventModel.SUBMIT_CHOICE, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      if (!arg) {
        return;
      }
      console.log(arg);
      MatchModel.makeChoice(userId, name, email, room, arg, ws);
    }
  });

  socket.on(EventModel.NEXT_SLIDE, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      console.log("next slide");
      MatchModel.nextSlide(userId, room, ws);
    }
  });

  socket.on(EventModel.PREV_SLIDE, (arg) => {
    if (SocketModel.isAuthorized(userId, room)) {
      console.log("prev slide");
      MatchModel.prevSlide(userId, room, ws);
    }
  });
};
