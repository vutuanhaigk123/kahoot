import React from "react";
import { useSelector } from "react-redux";
import { WS_EVENT } from "../../commons/constants";
import useSort from "../useSort";

const useQuesHistory = (socketContext) => {
  const socketPlayer = useSelector((state) => state?.socketPlayer);
  const [quesHistory, setQuesHistory] = React.useState(
    socketPlayer.quesHistory || []
  );
  const { sortedData, setSortBy, sortBy } = useSort(quesHistory);

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
        // const quesHisTmp = [...quesHistory];
        // const quesAnswered = quesHisTmp.find((ques) => ques.id === arg);
        // console.log(quesAnswered);
        // if (quesAnswered) {
        //   quesAnswered.isAnswered = true;
        //   setQuesHistory(quesHisTmp);
        // }
        const updatedData = quesHistory.map((obj) => {
          if (obj.id === arg) {
            return { ...obj, isAnswered: true };
          } else return obj;
        });
        setQuesHistory(updatedData);
      });

      socketContext.on(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT, (arg) => {
        console.log("upvote", arg);
        // const quesHisTmp = [...quesHistory];
        // const ques = quesHisTmp.find((question) => question.id === arg.id);
        // if (ques) {
        //   console.log(ques);
        //   ques.upVotes += 1;
        //   if (arg.isYou) {
        //     ques.isVoted = true;
        //   }
        //   setQuesHistory(quesHisTmp);
        // }
        const updatedData = quesHistory.map((obj) => {
          if (obj.id === arg.id) {
            return {
              ...obj,
              upVotes: parseInt(obj.upVotes) + 1,
              isVoted: arg.isYou ? true : obj.isVoted
            };
          } else return obj;
        });
        setQuesHistory(updatedData);
      });

      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_UPVOTE_QUESTION_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext, sortedData]);

  return { quesHistory, sortedData, setSortBy, sortBy };
};

export default useQuesHistory;
