/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { SUBMIT_STATUS } from "../../commons/constants";
import PresentationChart from "../../components/chart/PresentationChart";
import PopupMsg from "../../components/notification/PopupMsg";

const dataChart = [
  {
    name: "A",
    total: 1
  },
  {
    name: "B",
    total: 2
  },
  {
    name: "C",
    total: 3
  },
  {
    name: "D",
    total: 4
  }
];

const toIndex = (choiceId) => {
  return dataChart.findIndex((choice) => choice.name === choiceId);
};

const PresentationOwnerPage = () => {
  const [, setWs] = useState(null);
  const [data, setData] = useState(dataChart);
  const [isConnected, setIsConnected] = useState(true);

  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }
    const cmd = 2;
    const room = -1;
    const JOIN_ROOM_EVENT = "2";
    const INIT_CONNECTION_EVENT = "1";
    const EXIT_ROOM_EVENT = "-2";
    const RECEIVE_CHOICE_EVENT = "-3";
    const socket = io(wsDomain, {
      query: `cmd=${cmd}&room=${room}`,
      withCredentials: true
    });
    socket.on(INIT_CONNECTION_EVENT, (arg) => {
      setIsConnected(true);
      console.log("==========================================");
      console.log(arg);
    });

    socket.on(JOIN_ROOM_EVENT, (arg) => {
      console.log(
        "=====================Member has just joined room====================="
      );
      console.log(arg);
    });

    socket.on(EXIT_ROOM_EVENT, (arg) => {
      console.log(
        "=====================Member has just leaved room====================="
      );
      console.log(arg);
    });

    socket.on(RECEIVE_CHOICE_EVENT, (arg) => {
      console.log(
        "=====================Another player has make a choice====================="
      );
      console.log(arg);
      const choiceId = arg.choiceId.toString();
      const index = toIndex(choiceId);
      if (index !== -1) {
        data[index].total += 1;
        return setData([...data]);
      }
    });

    socket.io.on("close", (reason) => {
      if (reason !== "forced close") {
        return console.log(
          "PresentationOwnerPage: error to connect socket, " + reason
        );
      }
      setIsConnected(false);
    });

    setWs(socket);
    return () => socket.close();
  }, []);

  return (
    <Box>
      <div>Owner's presentation screen</div>
      <PresentationChart data={data} />
      <PopupMsg
        isOpen={!isConnected}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        Only support 1 connection at a time
      </PopupMsg>
    </Box>
  );
};

export default PresentationOwnerPage;
