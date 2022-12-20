/* eslint-disable import/extensions */
import { getNewObjectId } from "../utils/database.js";
import { getCurTimestampUTC } from "../utils/time.js";

export default {
  doAsk(userId, name, content, matchInfo) {
    if (matchInfo && matchInfo.userQuestions) {
      const data = {
        id: getNewObjectId().toString(),
        userId,
        content,
        ts: getCurTimestampUTC(),
        isAnswered: false,
        upVotes: [],
        name
      };
      matchInfo.userQuestions.push(data);
      return data;
    }
    return null;
  },

  doMarkAnsweredQues(userId, name, quesId, matchInfo) {
    if (matchInfo) {
      if (matchInfo.owner !== userId) {
        return false;
      }
      const quesInfo = matchInfo.userQuestions.find(
        (userQues) => userQues.id === quesId
      );
      if (quesInfo) {
        quesInfo.isAnswered = true;
        return true;
      }
    }
    return false;
  }
};
