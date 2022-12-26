import { Check, Close, QuestionMark, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import Carousel from "./components/Carousel";
import Transition from "./../components/Transition";
import { useSocket } from "../../../../context/socket-context";
import { SORT_BY, SORT_BY_ARR, WS_EVENT } from "../../../../commons/constants";
import { useSelector } from "react-redux";
import { convertTS } from "./../../../../utils/convertTime";
import { grey } from "@mui/material/colors";
import useSort from "../../../../hooks/useSort";

const OwnerQuestionModal = ({ isOpen, handleClosePopup, toggleNotify }) => {
  const { user } = useSelector((state) => state?.auth);
  const { socketContext } = useSocket();
  const [originalQuesHis, setOriginalQuesHis] = useState([]);
  const [currentQues, setCurrentQues] = React.useState(0);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
    setCurrentQues(0);
  };

  const { setSortBy, sortBy, sortedData } = useSort(originalQuesHis);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log("init connection event in question modal");
        console.log(arg);
        setOriginalQuesHis(arg.quesHistory);
      });
      return () => {
        socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.RECEIVE_QUESTION_EVENT, (arg) => {
        setOriginalQuesHis([...originalQuesHis, { ...arg }]);
        if (user.data.id !== arg.userId && !isOpen) {
          toggleNotify(true);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT, (arg) => {
        const orgQuesHisTmp = [...originalQuesHis];
        const orgQuesAnswered = orgQuesHisTmp.find((ques) => ques.id === arg);
        if (orgQuesAnswered) {
          orgQuesAnswered.isAnswered = true;
          setOriginalQuesHis(orgQuesHisTmp);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT, (arg) => {
        console.log("upvote", arg);
        const orgQuesHisTmp = [...originalQuesHis];
        const orgQues = orgQuesHisTmp.find((question) => {
          return question.id === arg.id;
        });
        if (orgQues) {
          orgQues.upVotes += 1;
          setOriginalQuesHis(orgQuesHisTmp);
        }
      });

      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, socketContext]);

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent
        sx={{
          display: "flex",
          padding: "10px 50px 10px 50px",
          gap: 2,
          height: "60vh",
          position: "relative",
          p: "5px 10px 5px 10px"
        }}
      >
        {/* Close button */}
        <Close
          sx={[
            { position: "absolute", top: 5, right: 5 },
            iconButton,
            iconHover("error.main")
          ]}
          onClick={handleClosePopup}
        />
        {originalQuesHis.length !== 0 ? (
          <>
            {/* Sidebar */}
            <Stack
              sx={{
                width: "20%",
                gap: 2,
                p: 2,
                maxHeight: " 100%",
                overflow: "scroll"
              }}
            >
              {/* Sort dropdown */}
              <FormControl fullWidth>
                <Select value={sortBy} onChange={handleChange}>
                  {SORT_BY_ARR.map((sortType, key) => {
                    return (
                      <MenuItem key={key} value={sortType.value}>
                        {sortType.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {/* Question list */}
              {sortedData.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentQues(index)}
                  sx={{
                    cursor: "pointer",
                    border: 1,
                    p: 1,
                    borderColor:
                      index === currentQues ? "primary.main" : grey[400],
                    borderRadius: 1,
                    transition: "transform .2s",
                    transform: index === currentQues ? "scale(1.05)" : null
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "80%",
                        gap: "2px"
                      }}
                    >
                      {item.isAnswered ? <Check /> : <QuestionMark />}
                      <Typography
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {item.content}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px"
                      }}
                    >
                      <ThumbUpOffAlt />
                      <Typography variant="subtitle1">
                        {item.upVotes && item.upVotes > 0 ? item.upVotes : ""}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color={grey[600]}>
                    {convertTS(item.ts)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Question carousel */}
            {sortedData.length !== 0 ? (
              <Carousel
                currentQues={currentQues}
                setCurrentQues={setCurrentQues}
                slides={sortedData}
              />
            ) : (
              <Typography variant="h2" sx={{ m: "auto", textAlign: "center" }}>
                {sortBy === SORT_BY.ANSWERED
                  ? "There is no answered questions"
                  : "There is no unanswered questions"}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="h2" sx={{ m: "auto" }}>
            No question yet
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OwnerQuestionModal;
