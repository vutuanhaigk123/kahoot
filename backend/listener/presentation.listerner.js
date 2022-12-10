/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import EventModel from "../model/event.model.js";
import MatchModel from "../model/match.model.js";

export default async (ws, socket, userId, cmd, room, slide) => {
  socket.on(EventModel.SUBMIT_CHOICE, (arg) => {
    console.log(arg);
    MatchModel.makeChoice(userId, room, arg, ws);
  });

  socket.on(EventModel.NEXT_SLIDE, (arg) => {
    console.log("next slide");
    MatchModel.nextSlide(userId, room, ws);
  });

  socket.on(EventModel.PREV_SLIDE, (arg) => {
    console.log("prev slide");
    MatchModel.prevSlide(userId, room, ws);
  });
};
