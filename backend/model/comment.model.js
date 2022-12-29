/* eslint-disable import/extensions */
import Message from "../schemas/messageSchema.js";
import { getNewObjectId } from "../utils/database.js";
import { getCurTimestampUTC } from "../utils/time.js";

export default {
  async findById(id) {
    const result = await Message.findById({ _id: id }).exec();
    return result;
  },

  async storeMessage(presentationId, message) {
    const newMsg = {
      _id: message.id,
      userId: message.userId,
      text: message.text,
      ts: message.ts,
      name: message.name
    };
    let presentationMsg = await this.findById(presentationId);
    if (presentationMsg) {
      presentationMsg.contents.push(newMsg);
    } else {
      presentationMsg = new Message({
        _id: presentationId,
        contents: [newMsg]
      });
    }
    const result = await presentationMsg.save();
    return result;
  },

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
      this.storeMessage(matchInfo.roomId, data);
      return data;
    }
    return null;
  }
};
