import React from "react";
import { useSelector } from "react-redux";
import { WS_EVENT } from "../../commons/constants";

const useChat = (socketContext, toggleNotify, isOpen) => {
  const { user } = useSelector((state) => state?.auth);
  const socketPlayer = useSelector((state) => state?.socketPlayer);
  const [chatHistory, setChatHistory] = React.useState(
    socketPlayer.chatHistory || []
  );
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
            toggleNotify(true);
          }
        }
      });
      return () => {
        socketContext.off(WS_EVENT.RECEIVE_CMT_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, chatHistory, socketContext]);
  return { chatHistory };
};

export default useChat;
