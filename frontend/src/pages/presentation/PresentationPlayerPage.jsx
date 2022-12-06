/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

const room = -1;
const JOIN_ROOM_CMD = "2";
const INIT_CONNECTION_EVENT = "1";
const EXIT_ROOM_EVENT = "-2";
const SUBMIT_CHOICE_EVENT = "3";
const RECEIVE_CHOICE_EVENT = "-3";

const handleSubmitChoice = ({ socket, choiceId }) => {
  if (socket) {
    console.log(choiceId);
    socket.emit(SUBMIT_CHOICE_EVENT, choiceId);
  } else {
    console.log("Not connected to server");
  }
};

const PresentationPlayerPage = () => {
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");

  const [ws, setWs] = useState(null);
  const [question, setQuestion] = useState(null);
  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }

    const socket = io(wsDomain, {
      query: `cmd=${JOIN_ROOM_CMD}&room=${id}&slide=${slide}}`,
      withCredentials: true
    });
    socket.on(INIT_CONNECTION_EVENT, (arg) => {
      console.log("==========================================");
      console.log(arg);
      setQuestion(arg.curQues);
    });

    socket.on(RECEIVE_CHOICE_EVENT, (arg) => {
      console.log(
        "=====================Another member has make a choice====================="
      );
      console.log(arg);
    });

    setWs(socket);
    return () => {
      if (ws) socket.close();
    };
  }, []);

  return question ? (
    <div>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {question.question}
        </Typography>
      </Box>
      {question.answers.map((value, index) => {
        return (
          <BasicButton
            key={value.id}
            variant="text"
            onClick={() =>
              handleSubmitChoice({ socket: ws, choiceId: value.id })
            }
          >
            {value.des}
          </BasicButton>
        );
      })}
    </div>
  ) : (
    ""
  );
};

export default PresentationPlayerPage;
