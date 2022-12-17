/* eslint-disable import/extensions */
import { getNewObjectId } from "../utils/database.js";
import { getCurTimestampUTC } from "../utils/time.js";

export default {
  doComment(userId, name, content, matchInfo) {
    if (matchInfo && matchInfo.comments) {
      const data = {
        id: getNewObjectId().toString(),
        userId,
        text: content,
        ts: getCurTimestampUTC(),
        name
      };
      matchInfo.comments.push(data);
      return data;
    }
    return null;
  }
};
