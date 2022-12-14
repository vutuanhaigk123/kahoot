import { ArrowBack, Close } from "@mui/icons-material";
import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import React from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import BasicButton from "../../../../components/button/BasicButton";
import AskQuestion from "./components/AskQuestion";
import QuestionList from "../owner/components/QuestionList";
import Transition from "../components/Transition";
import { useSocket } from "../../../../context/socket-context";
import useQuesHistory from "./../../../../hooks/socket/useQuesHistory";

const PAGE = { LIST_PAGE: 0, ASK_PAGE: 1 };

const PlayerQuestionModal = ({ isOpen, handleClosePopup }) => {
  const { socketContext } = useSocket();
  const { sortedData, setSortBy, sortBy, quesHistory } =
    useQuesHistory(socketContext);
  const [curPage, setCurPage] = React.useState(PAGE.LIST_PAGE);

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      fullWidth
    >
      <DialogContent
        sx={{
          display: "flex",
          padding: "10px 50px 10px 50px",
          gap: 2,
          maxHeight: "60vh",
          minHeight: "20vh",
          position: "relative",
          p: "5px 10px 20px 10px"
        }}
      >
        {/* Back button */}
        {curPage === PAGE.ASK_PAGE ? (
          <BasicButton
            icon={<ArrowBack />}
            variant="text"
            sx={{ position: "absolute" }}
            onClick={() => setCurPage(PAGE.LIST_PAGE)}
          >
            Back
          </BasicButton>
        ) : null}

        {/* Close button */}
        <Close
          sx={[
            { position: "absolute", top: 5, right: 5 },
            iconButton,
            iconHover("error.main")
          ]}
          onClick={handleClosePopup}
        />
        <Stack
          sx={{
            width: "100%",
            gap: 2,
            m: "auto",
            textAlign: "center",
            mt: "10%",
            maxHeight: "50vh"
          }}
        >
          {curPage === PAGE.LIST_PAGE ? (
            <>
              <Typography variant="h4">Question list</Typography>
              <QuestionList
                orgData={quesHistory}
                sortedData={sortedData}
                setSortBy={setSortBy}
                sortBy={sortBy}
              />
              <BasicButton onClick={() => setCurPage(PAGE.ASK_PAGE)}>
                Ask a new question
              </BasicButton>
            </>
          ) : (
            <AskQuestion returnToListPage={() => setCurPage(PAGE.LIST_PAGE)} />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerQuestionModal;
