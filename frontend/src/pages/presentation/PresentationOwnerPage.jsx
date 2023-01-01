/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { WS_CMD, WS_DATA } from "../../commons/constants";
import ConfirmPopup from "../../components/notification/ConfirmPopup";
import { useSocket } from "../../context/socket-context";
import usePresentationOwner from "../../hooks/socket/owner/usePresentationOwner";
import usePopup from "../../hooks/usePopup";
import Presentation from "./components/Presentation";

const PresentationOwnerPage = () => {
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");
  const group = searchParam.get("group");

  // Socket context
  const { socketContext, setSocketContext } = useSocket();

  const {
    open: openConfirm,
    handleClosePopup: handleCloseConfirmPopup,
    handleOpenPopup: handleOpenConfirmPopup
  } = usePopup();

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
    userShortInfoList,
    hasPrevPresentation
  } = usePresentationOwner(socketContext, setSocketContext, id, slide, group);

  const handleNavPrvPresentation = () => {
    console.log("handle navigate to prev presentation");
    socketContext.emit(
      WS_CMD.CLOSE_PREV_PRESENTATION,
      WS_DATA.DENIED_CLOSE_PREV_PRESENTATION
    );
    handleCloseConfirmPopup();
  };

  React.useEffect(() => {
    if (hasPrevPresentation) {
      handleOpenConfirmPopup();
    } else {
      handleCloseConfirmPopup();
    }
  }, [hasPrevPresentation]);

  return (
    <>
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
      />

      <ConfirmPopup
        isOpen={openConfirm}
        handleRedirect={handleNavPrvPresentation}
        handleConfirm={() => {
          console.log("handle close prev presentation");
          socketContext.emit(
            WS_CMD.CLOSE_PREV_PRESENTATION,
            WS_DATA.ALLOW_CLOSE_PREV_PRESENTATION
          );
        }}
        noBtnLabel="Redirect"
      >
        Do you want to close previous presentation
      </ConfirmPopup>
    </>
  );
};
export default PresentationOwnerPage;
