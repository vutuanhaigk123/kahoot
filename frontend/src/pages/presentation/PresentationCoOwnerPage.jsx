/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ROLE } from "../../commons/constants";
import { useSocket } from "../../context/socket-context";
import usePresentationOwner from "../../hooks/socket/owner/usePresentationOwner";
import Presentation from "./components/Presentation";

const PresentationOwnerPage = () => {
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const group = searchParam.get("group");

  // Socket context
  const { socketContext, setSocketContext } = useSocket();

  // Handle socket
  const {
    isEnd,
    isFirst,
    isConnected,
    data,
    ws,
    msgClose,
    question,
    handleNextSlide,
    handlePrevSlide,
    curQuesType,
    userShortInfoList
  } = usePresentationOwner(
    socketContext,
    setSocketContext,
    id,
    null,
    group,
    ROLE.co_owner
  );

  return (
    <Presentation
      data={data}
      id={id}
      handleNextSlide={handleNextSlide}
      handlePrevSlide={handlePrevSlide}
      isConnected={isConnected}
      isEnd={isEnd}
      isFirst={isFirst}
      msgClose={msgClose}
      question={question}
      ws={ws}
      curQuesType={curQuesType}
      userShortInfoList={userShortInfoList}
      canEnd={false}
    />
  );
};
export default PresentationOwnerPage;
