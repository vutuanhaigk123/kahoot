import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { Close, Send } from "@mui/icons-material";
import { iconButton, iconHover } from "./../../../../commons/globalStyles";
import Transition from "../components/Transition";
import TextBox from "./../../../../components/input/TextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import { useSocket } from "../../../../context/socket-context";
import { WS_CMD, WS_EVENT } from "../../../../commons/constants";
import { useSelector } from "react-redux";

// const data = [
//   {
//     name: "user 1 dsadsadsa d",
//     text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio ex, suscipitdasdasdsadsadsad dsadsadsadasdasdsadsadasdasd dsadsa",
//     currentUser: 0
//   },
//   { name: "user 2", text: "Chào cl", currentUser: 1 }
// ];

const ChatBox = ({ isOpen, handleClosePopup, toggleNotify }) => {
  const { user } = useSelector((state) => state?.auth);
  const [chatHistory, setChatHistory] = useState([]);
  const { socketContext } = useSocket();
  const schema = yup.object({
    msg: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    // console.log("🚀 ~ file: ChatBox.jsx:21 ~ ChatBox ~ data", data);
    socketContext.emit(WS_CMD.SEND_CMT_CMD, data.msg);
    reset();
  };

  React.useEffect(() => {
    if (socketContext) {
      console.log(socketContext);
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log(arg);
        if (arg && arg.chatHistory) {
          setChatHistory(arg.chatHistory);
        }
      });
      return () => {
        socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.RECEIVE_CMT_EVENT, (arg) => {
        if (arg) {
          console.log(arg);
          setChatHistory([...chatHistory, { ...arg }]);
          if (user.data.id !== arg.userId && !isOpen) {
            toggleNotify();
          }
        }
      });
      return () => {
        socketContext.off(WS_EVENT.RECEIVE_CMT_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, chatHistory, socketContext]);

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent
        sx={{
          display: "flex",
          padding: "10px 50px 10px 50px",
          gap: 2,
          height: "60vh",
          position: "relative",
          p: "5px 10px 30px 10px"
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
        <Stack sx={{ mt: 6, width: "100%", height: "calc(100% - 48px)" }}>
          <form style={{ height: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {/* Chat view area */}
            <Box
              sx={{
                border: 1,
                borderColor: grey[400],
                borderRadius: 1,
                height: "calc(100% - 80px)",
                mb: 2,
                p: 1,
                overflowY: "scroll",
                minWidth: 0
              }}
            >
              {chatHistory.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    width: "100%"
                  }}
                >
                  {/* Avatar + name */}
                  <Tooltip title={item.name}>
                    <Avatar />
                  </Tooltip>
                  {/* Text */}
                  <Box>
                    <Typography variant="caption" color={grey[600]}>
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        border: 1,
                        p: 1,
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* Chat send area */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextBox
                fullWidth
                placeholder="Type message here"
                helperText={errors.msg ? errors.msg.message : ""}
                name="msg"
                control={control}
              />
              <Box>
                <IconButton type="submit" sx={{ p: 0 }}>
                  <Send
                    sx={[
                      {
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "white"
                        },
                        mt: "2px"
                      },
                      iconButton
                    ]}
                  />
                </IconButton>
              </Box>
            </Box>
          </form>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBox;
