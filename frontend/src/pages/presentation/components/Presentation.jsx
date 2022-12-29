import { Badge, Box, Link, Paper, Tooltip, Typography } from "@mui/material";
import React from "react";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import PopupMsg from "../../../components/notification/PopupMsg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  PAGE_ROUTES,
  questionType,
  SUBMIT_STATUS
} from "../../../commons/constants";
import BasicButton from "../../../components/button/BasicButton";
import {
  ArrowBack,
  ArrowLeft,
  ArrowRight,
  Chat,
  ContentCopy,
  QuestionAnswer
} from "@mui/icons-material";
import { iconButton, iconHover } from "../../../commons/globalStyles";
import OwnerQuestionModal from "../modal/owner/OwnerQuestionModal";
import usePopup from "../../../hooks/usePopup";
import useToggle from "../../../hooks/useToggle";
import ChatBox from "../modal/chat/ChatBox";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmPopup from "../../../components/notification/ConfirmPopup";
import PresentationType from "./PresentationType";

const Presentation = ({
  isConnected,
  id,
  ws,
  msgClose,
  data,
  isFirst,
  isEnd,
  question,
  handlePrevSlide,
  handleNextSlide,
  curQuesType
}) => {
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
  const {
    open: openConfirmMsg,
    handleClosePopup: handleCloseConfirmMsg,
    handleOpenPopup: handleOpenConfirmMsg
  } = usePopup();

  // Notify
  const { value: isNotify, toggleValue: toggleNotify } = useToggle(false);
  const { value: isNotifyQues, toggleValue: toggleNotifyQues } =
    useToggle(false);

  const navigate = useNavigate();
  const [isEnding, setIsEnding] = React.useState(false);
  const handleEndPresentation = () => {
    setIsEnding(true);

    // To-do close connection
    // Here

    handleCloseConfirmMsg();
    setTimeout(() => {
      navigate(`${PAGE_ROUTES.PRESENTATION}/${id}`);
    }, 500);
    setIsEnding(false);
  };

  const [searchParam] = useSearchParams();
  const groupId = searchParam.get("group");

  return (
    <BackgroundContainer>
      {isConnected && id ? (
        <>
          <ArrowBack
            sx={[
              iconButton,
              iconHover("primary.light"),
              { bgcolor: "primary.main", color: "white" }
            ]}
            onClick={handleOpenConfirmMsg}
          />
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
            {/* Hide question if not multiple choice */}
            {curQuesType === questionType.MULTIPLE_CHOICE ? (
              <Typography variant="h4" sx={{ mb: 2 }}>
                {question}
              </Typography>
            ) : null}

            {/* Hide invite button if present in group */}
            {groupId ? null : (
              <CopyToClipboard
                text={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.SLIDES_JOIN}?id=${id}`}
              >
                <BasicButton
                  icon={isCopy ? <ContentCopy /> : <Link />}
                  onClick={() => {
                    setIsCopy(true);
                    setTimeout(() => {
                      setIsCopy(false);
                    }, 2000);
                  }}
                  color={isCopy ? "success" : "primary"}
                  sx={{ mb: 2 }}
                >
                  {isCopy ? "Link coppied" : "Get invite link"}
                </BasicButton>
              </CopyToClipboard>
            )}

            {/* Presentation */}
            <Box
              sx={{
                height: "100%",
                width: "100%",
                position: "relative",
                textAlign: "center",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {/* Chart */}
              <PresentationType
                curQuesType={curQuesType}
                data={data}
                question={question}
              />

              {/* Navigation */}
              {!isFirst ? (
                <ArrowLeft
                  onClick={() => handlePrevSlide(ws)}
                  fontSize="large"
                  sx={[
                    {
                      position: "absolute",
                      left: 0,
                      top: "40%"
                    },
                    iconButton
                  ]}
                />
              ) : null}
              {!isEnd ? (
                <ArrowRight
                  onClick={() => handleNextSlide(ws)}
                  fontSize="large"
                  sx={[
                    { position: "absolute", top: "40%", right: 0 },
                    iconButton
                  ]}
                />
              ) : null}
            </Box>

            {/* Chat + question icon */}
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
                <Badge color="primary" variant="dot" invisible={!isNotifyQues}>
                  <QuestionAnswer
                    sx={[iconHover(), iconButton]}
                    onClick={() => {
                      handleOpenQuestionPopup();
                      toggleNotifyQues(false);
                    }}
                  />
                </Badge>
              </Tooltip>
            </Box>

            {/* Question modal */}
            <OwnerQuestionModal
              isOpen={openQuestion}
              handleClosePopup={handleCloseQuestionPopup}
              toggleNotify={toggleNotifyQues}
            ></OwnerQuestionModal>

            {/* Chat modal */}
            <ChatBox
              isOpen={openChat}
              handleClosePopup={handleCloseChatPopup}
              toggleNotify={toggleNotify}
            ></ChatBox>
          </Paper>
        </>
      ) : null}
      <div className="modal-presentation">
        {/* Connection modal */}
        <PopupMsg
          isOpen={!isConnected && !ws}
          hasOk={false}
          status={SUBMIT_STATUS.ERROR}
          handleClosePopup={() => console.log()}
        >
          {msgClose}
        </PopupMsg>
        {/* End presentation modal */}
        <ConfirmPopup
          isOpen={openConfirmMsg}
          handleClose={handleCloseConfirmMsg}
          handleConfirm={() => handleEndPresentation()}
          isConfirming={isEnding}
        >
          Are you sure you want end the presentation
        </ConfirmPopup>
      </div>
    </BackgroundContainer>
  );
};

export default Presentation;
