import React from "react";
import { useSelector } from "react-redux";
import { WS_EVENT } from "../../commons/constants";

const useQuesHistory = (socketContext) => {
  const socketPlayer = useSelector((state) => state?.socketPlayer);
  const [quesHistory, setQuesHistory] = React.useState(
    socketPlayer.quesHistory || []
  );

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
  }, [socketContext]);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.RECEIVE_QUESTION_EVENT, (arg) => {
        setQuesHistory([...quesHistory, { ...arg }]);
        console.log(arg);
      });

      socketContext.on(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT, (arg) => {
        console.log("===A Question answered===");
        const quesHisTmp = [...quesHistory];
        const quesAnswered = quesHisTmp.find((ques) => ques.id === arg);
        console.log(quesAnswered);
        if (quesAnswered) {
          quesAnswered.isAnswered = true;
          setQuesHistory(quesHisTmp);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT, (arg) => {
        console.log("upvote", arg);
        const quesHisTmp = [...quesHistory];
        const ques = quesHisTmp.find((question) => question.id === arg);
        if (ques) {
          console.log(ques);
          ques.upVotes += 1;
          setQuesHistory(quesHisTmp);
        }
      });

      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT);
      };
    }
  }, [quesHistory, socketContext]);

  return { quesHistory };
};

export default useQuesHistory;
