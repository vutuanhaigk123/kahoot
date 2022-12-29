/* eslint-disable import/extensions */
import Question from "../schemas/questionsSchema.js";
import { getNewObjectId } from "../utils/database.js";
import { getCurTimestampUTC } from "../utils/time.js";

export default {
  async findById(id) {
    const result = await Question.findById({ _id: id }).exec();
    return result;
  },

  async storeQuestion(presentationId, question) {
    const ques = {
      _id: question.id,
      userId: question.userId,
      content: question.content,
      ts: question.ts,
      isAnswered: question.isAnswered,
      upVotes: question.upVotes,
      name: question.name
    };
    let presentationQuestions = await this.findById(presentationId);
    if (presentationQuestions) {
      presentationQuestions.contents.push(ques);
    } else {
      presentationQuestions = new Question({
        _id: presentationId,
        contents: [ques]
      });
    }
    const result = await presentationQuestions.save();
    return result;
  },

  async storeMarkAsAnswered(presentationId, questionId) {
    const result = await Question.updateOne(
      {
        _id: presentationId,
        "contents._id": questionId
      },
      { $set: { "contents.$.isAnswered": true } }
    ).exec();
    return result;
  },

  async storeUpVoteQues(presentationId, questionId, uidUpVote) {
    const result = await Question.updateOne(
      {
        _id: presentationId,
        "contents._id": questionId
      },
      { $push: { "contents.$.upVotes": uidUpVote } }
    ).exec();
    return result;
  },

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
      this.storeQuestion(matchInfo.roomId, data);
      return data;
    }
    return null;
  },

  doMarkAnsweredQues(userId, name, quesId, matchInfo) {
    if (matchInfo) {
      if (
        matchInfo.owner !== userId &&
        matchInfo.coOwners.findIndex((coOwner) => coOwner.id === userId) === -1
      ) {
        return false;
      }
      const quesInfo = matchInfo.userQuestions.find(
        (userQues) => userQues.id === quesId
      );
      if (quesInfo) {
        quesInfo.isAnswered = true;
        this.storeMarkAsAnswered(matchInfo.roomId, quesId);
        return true;
      }
    }
    return false;
  },

  doUpVoteQues(userId, quesId, matchInfo) {
    if (matchInfo && userId !== matchInfo.owner) {
      const quesInfo = matchInfo.userQuestions.find(
        (userQues) => userQues.id === quesId
      );
      if (quesInfo && !quesInfo.upVotes.includes(userId)) {
        quesInfo.upVotes.push(userId);
        this.storeUpVoteQues(matchInfo.roomId, quesId, userId);
        return true;
      }
    }
    return false;
  }
};
