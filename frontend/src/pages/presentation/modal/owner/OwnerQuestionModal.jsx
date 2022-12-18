import { Check, Close, QuestionMark, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
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

const sortBy = (originalData, sortType) => {};

const OwnerQuestionModal = ({ isOpen, handleClosePopup, toggleNotify }) => {
  const { user } = useSelector((state) => state?.auth);
  const { socketContext } = useSocket();
  const [quesHistory, setQuesHistory] = useState([]);
  const [currentQues, setCurrentQues] = React.useState(0);

  const [sortBy, setSortBy] = useState(SORT_BY.TIME_ASKED_ASC);
  const handleChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
  };

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log("init connection event in question modal");
        console.log(arg);
        setQuesHistory(arg.quesHistory);
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
        setQuesHistory([...quesHistory, { ...arg }]);
        if (user.data.id !== arg.userId && !isOpen) {
          toggleNotify(true);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT, (arg) => {
        const quesHisTmp = [...quesHistory];
        const quesAnswered = quesHisTmp.find((ques) => ques.id === arg);
        console.log(quesAnswered);
        if (quesAnswered) {
          quesAnswered.isAnswered = true;
          setQuesHistory(quesHisTmp);
        }
      });

      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, quesHistory, socketContext]);

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
        {quesHistory.length !== 0 ? (
          <>
            {/* Sidebar */}
            <Stack sx={{ width: "20%", gap: 2 }}>
              {/* Dropdonw */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortBy}
                  label="Sort by"
                  onChange={handleChange}
                >
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
              {quesHistory.map((item, index) => (
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
                      sx={{ display: "flex", alignItems: "center", gap: "2px" }}
                    >
                      <ThumbUpOffAlt />
                      <Typography variant="subtitle1">{5}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption">
                    {convertTS(item.ts)}
                  </Typography>
                </Box>
              ))}
            </Stack>
            {/* Question carousel */}
            <Carousel
              currentQues={currentQues}
              setCurrentQues={setCurrentQues}
              slides={quesHistory}
            />
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
