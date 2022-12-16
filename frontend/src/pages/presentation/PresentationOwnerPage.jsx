/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Box, Paper, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE_ROUTES, SUBMIT_STATUS } from "../../commons/constants";
import PresentationChart from "../../components/chart/PresentationChart";
import PopupMsg from "../../components/notification/PopupMsg";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import BasicButton from "../../components/button/BasicButton";
import { Chat, ContentCopy, Link, QuestionAnswer } from "@mui/icons-material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { iconButton, iconHover } from "./../../commons/globalStyles";
import usePopup from "./../../hooks/usePopup";
import OwnerQuestionModal from "./modal/owner/OwnerQuestionModal";
import ChatBox from "./modal/chat/ChatBox";
import { useSocket } from "../../context/socket-context";
import usePresentationOwner from "../../hooks/socket/owner/usePresentationOwner";
import useToggle from "./../../hooks/useToggle";

const PresentationOwnerPage = () => {
  const [isCopy, setIsCopy] = React.useState(false);
  // Popup
  const {
    open: openQuestion,
    handleOpenPopup: handleOpenQuestionPopup,
    handleClosePopup: handleCloseQuestionPopup
  } = usePopup();
  const {
    open: openChat,
    handleOpenPopup: handleOpenChatPopup,
    handleClosePopup: handleCloseChatPopup
  } = usePopup();

  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");

  const { value: isNotify, toggleValue: toggleNotify } = useToggle(false);

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
    handleSendComment,
    handleSendCmd
  } = usePresentationOwner(socketContext, setSocketContext, id, slide);

  return (
    <BackgroundContainer>
      {isConnected && id && slide ? (
        <Paper
          elevation={10}
          sx={{
            width: "80%",
            height: "70vh",
            m: "auto",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            p: 2
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            {question}
          </Typography>
          <CopyToClipboard
            text={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.SLIDES_JOIN}?id=${id}&slide=${slide}`}
          >
            <BasicButton
              icon={isCopy ? <ContentCopy /> : <Link />}
              onClick={() => setIsCopy(true)}
              color={isCopy ? "success" : "primary"}
              sx={{ mb: 2 }}
            >
              {isCopy ? "Link coppied" : "Get invite link"}
            </BasicButton>
          </CopyToClipboard>
          <PresentationChart data={data} height={"100%"} />
          {!isEnd ? (
            <BasicButton onClick={() => handleNextSlide(ws)}>Next</BasicButton>
          ) : (
            ""
          )}
          {!isFirst ? (
            <BasicButton onClick={() => handlePrevSlide(ws)}>Prev</BasicButton>
          ) : (
            ""
          )}
          <BasicButton
            onClick={() => handleSendComment(ws, "Day la chat test")}
          >
            Send chat
          </BasicButton>
          <BasicButton onClick={() => handleSendCmd(ws)}>
            Change presentation
          </BasicButton>
          <Box
            direction="row"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              gap: "10px"
            }}
          >
            <Tooltip title="Chat" variant="soft">
              <Badge color="primary" variant="dot" invisible={!isNotify}>
                <Chat
                  sx={[iconHover(), iconButton]}
                  onClick={() => {
                    handleOpenChatPopup();
                    toggleNotify(false);
                  }}
                />
              </Badge>
            </Tooltip>
            <Tooltip title="Q&A" variant="soft">
              <QuestionAnswer
                sx={[iconHover(), iconButton]}
                onClick={handleOpenQuestionPopup}
              />
            </Tooltip>
          </Box>

          {/* Question modal */}
          <OwnerQuestionModal
            isOpen={openQuestion}
            handleClosePopup={handleCloseQuestionPopup}
          ></OwnerQuestionModal>

          {/* Chat modal */}
          <ChatBox
            isOpen={openChat}
            handleClosePopup={handleCloseChatPopup}
            toggleNotify={toggleNotify}
          ></ChatBox>
        </Paper>
      ) : null}
      <PopupMsg
        isOpen={!isConnected && !ws}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        {msgClose}
      </PopupMsg>
    </BackgroundContainer>
  );
};
export default PresentationOwnerPage;
