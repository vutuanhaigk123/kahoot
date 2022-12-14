/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import HashMap from "hashmap";
import { ROLE, SLIDE_TYPE } from "../utils/database.js";
import { getCurTimestampUTC } from "../utils/time.js";
import CommentModel from "./comment.model.js";
import EventModel from "./event.model.js";
import groupModel from "./group.model.js";
import PresentationModel from "./presentation.model.js";
import QuestionModel from "./question.model.js";
import SlideModel from "./slide.model.js";
import SocketModel from "./socket.model.js";

const groupMap = new HashMap();
// groupId -> presentationId
const matches = new HashMap();
/*
    Structure:
    matches = {
      roomId: quiz room id,
      owner: owner id,
      coOwners: [{
        id: userId,
        picture: "picture link",
        name: "Name"
      }],
      timeout: timeoutDelete,
      curState: (lobby) || (leaderboard),
      curQues: question id,
      groupId: String || null,
      members: [{
        id: userId,
        picture: "picture link",
        name: "Name"
        score: 0
      }],
      comments: [
        {
          id: String,
          userId: String,
          text: String,
          ts: Number
        }
      ],
      userQuestions: [
        {
          id: String,
          userId: String,
          content: String,
          ts: Number,
          isAnswered: boolean,
          upVotes: [uid],
          name
        }
      ],
      questions: [{
        id: question id,
        title: "question 1: ...",
        answers: [{
          id: answer id,
          des: "This is an answer",
          total: 0,
          type: Number,
          choiceUserInfo: [{id: uid, ts: Number}]
        }],
        true_ans: answer id
      }],
      answers: [{
        id: question id,
        data: HashMap<uid, {choiceId: answer id, ts: Number, name: String, email: String}>
      }],
      userShortInfoList: [{
        id: uid,
        name: String,
        email: String
      }]
      
    }
*/
const isTesting = false;

const STATE_LOBBY_CODE = 1;
const STATE_LEADERBOARD_CODE = 2;

function sendMoveSlideEventForEachUser(
  matchInfo,
  curQues,
  questionIndex,
  eventName
) {
  const index = matchInfo.answers.findIndex(
    (question) => question.id === matchInfo.curQues
  );
  if (!isTesting && index !== -1) {
    const ans = matchInfo.answers[index];
    matchInfo.members.forEach(({ id }) => {
      SocketModel.sendEvent(id, eventName, {
        curQues,
        isVoted: ans.data.get(id) !== null
      });
    });
    const customData = {
      curState: matchInfo.curState,
      curQues
    };
    if (eventName === EventModel.RECEIVE_NEXT_SLIDE_EVENT) {
      customData.isEnd = questionIndex >= matchInfo.questions.length - 1;
    } else if (eventName === EventModel.RECEIVE_PREV_SLIDE_EVENT) {
      customData.isFirst = questionIndex === 0;
    }
    SocketModel.sendEvent(matchInfo.owner, eventName, customData);
    matchInfo.coOwners.forEach((coOwner) => {
      SocketModel.sendEvent(coOwner.id, eventName, customData);
    });
    return true;
  }
  return false;
}

function hideUidVotedQues(quesHistory) {
  const questions = [];
  quesHistory.forEach((ques) => {
    questions.push({ ...ques, upVotes: ques.upVotes.length });
  });
  return questions;
}

function assignUpVotedQuesOrNot(userId, quesHistory) {
  const questions = [];
  quesHistory.forEach((ques) => {
    questions.push({ ...ques, isVoted: ques.upVotes.includes(userId) });
  });
  return questions;
}

function compareScore(memberA, memberB) {
  return memberA.score - memberB.score;
}

async function getQuestionsInRoom(roomId) {
  const ret = await SlideModel.getSlidesByPresentationId(roomId);
  return ret;
}

function initMatch(
  roomId,
  ownerId,
  questions,
  slideId,
  groupId = null,
  comments = [],
  userQuestions = [],
  answers = [],
  members = [],
  coOwners = [],
  userShortInfoList = []
) {
  const questionsTmp = [];
  questions.forEach((eachQuestion) => {
    const ansListOfQues = [];
    eachQuestion.answers.forEach((ans) => {
      const choiceUserInfo = [];
      ans.choiceUids.forEach((element) => {
        choiceUserInfo.push({ id: element.uid, ts: element.ts });
      });
      ansListOfQues.push({
        id: ans._id,
        des: ans.des,
        total: ans.choiceUids.length,
        choiceUserInfo
      });
    });
    const ques = {
      id: eachQuestion._id,
      question: eachQuestion.question,
      type: eachQuestion.type
    };
    if (
      eachQuestion.type.toString() === SLIDE_TYPE.multiple_choice.toString()
    ) {
      ques.answers = ansListOfQues;
    } else if (eachQuestion.type.toString() === SLIDE_TYPE.heading.toString()) {
      ques.answers = [];
      ques.heading = eachQuestion.content;
    } else {
      ques.answers = [];
      ques.paragraph = eachQuestion.content;
    }
    questionsTmp.push(ques);
  });
  if (groupId) {
    groupMap.set(groupId, roomId);
  }
  return {
    roomId,
    timeout: null,
    members,
    curState: STATE_LOBBY_CODE,
    curQues: slideId || questionsTmp[0].id,
    groupId,
    coOwners,
    owner: ownerId,
    comments,
    userQuestions,
    questions: questionsTmp,
    answers,
    userShortInfoList
  };
}

function hasQuestion(questions, questionId) {
  if (!questions || !questions.length) {
    return -1;
  }
  return questions.findIndex((question) => question.id === questionId);
}

function isAnswerValid(answers, answerId) {
  if (!answers || !answers.length) {
    return -1;
  }
  return answers.findIndex((answer) => answer.id === answerId);
}

function getQuestion(questions, questionId) {
  if (!questions || !questions.length) {
    return null;
  }
  const index = questions.findIndex((question) => question.id === questionId);
  if (index === -1) {
    return null;
  }
  // ignore 2 cases above
  // if (questions[index].answers.length === 0) {
  //   return null;
  // }
  return questions[index];
}

async function isGroupMember(userId, matchInfo) {
  if (matchInfo && matchInfo.groupId !== null) {
    if (!(await groupModel.isGroupMember(userId, matchInfo.groupId))) {
      SocketModel.sendEvent(
        userId,
        EventModel.CLOSE_REASON,
        EventModel.REASON_NOT_FOUND_CONTENT
      );
      return false;
    }
  }
  return true;
}

async function isGroupCoOwner(userId, matchInfo) {
  if (matchInfo && matchInfo.groupId !== null) {
    if (!(await groupModel.isGroupCoOwner(userId, matchInfo.groupId))) {
      SocketModel.sendEvent(
        userId,
        EventModel.CLOSE_REASON,
        EventModel.REASON_NOT_FOUND_CONTENT
      );
      return false;
    }
  }
  return true;
}

function updateUserShortInfo(matchInfo, userId, name, email) {
  if (!matchInfo) {
    return;
  }
  const index = matchInfo.userShortInfoList.findIndex(
    (userShortInfo) => userShortInfo.id === userId
  );
  if (index === -1) {
    matchInfo.userShortInfoList.push({ id: userId, name, email });
  }
}

async function getShortUserInfoSubmittedChoice(questions) {
  const result = await PresentationModel.getShortUserInfoSubmittedChoice(
    questions
  );
  return result;
}

async function getOldComments(presentationId) {
  const comments = await CommentModel.findById(presentationId);
  if (comments) {
    const result = [];
    comments.contents.forEach(({ _id, userId, text, ts, name }) => {
      result.push({ id: _id, userId, text, ts, name });
    });
    return result;
  }
  return [];
}

async function getOldQuestions(presentationId) {
  const questions = await QuestionModel.findById(presentationId);
  if (questions) {
    const result = [];
    questions.contents.forEach(
      ({ _id, userId, content, ts, isAnswered, upVotes, name }) => {
        result.push({
          id: _id,
          userId,
          content,
          ts,
          isAnswered,
          upVotes,
          name
        });
      }
    );
    return result;
  }
  return [];
}

function updateJoinedMemberList(matchInfo, role, userId) {
  let index = -1;
  if (role === ROLE.member) {
    // co-owner already joinned as co-owner but change to join as player
    index = matchInfo.coOwners.findIndex((coOwner) => coOwner.id === userId);
  } else if (role === ROLE.co_owner) {
    // co-owner already joinned as player but change to join as co-owner
    index = matchInfo.members.findIndex((member) => member.id === userId);
  }
  if (index !== -1) {
    if (role === ROLE.member) {
      matchInfo.coOwners.splice(index, 1);
    } else {
      matchInfo.members.splice(index, 1);
    }
  }
}

export default {
  STATE_LOBBY: STATE_LOBBY_CODE,
  STATE_LEADERBOARD: STATE_LEADERBOARD_CODE,

  isMatchExist(presentationId) {
    const res = matches.get(presentationId);
    return res && res !== null;
  },

  getPresentationIdByGroupId(groupId) {
    return groupMap.get(groupId);
  },

  getOwnerIdByRoomId(roomId) {
    const matchInfo = matches.get(roomId);
    if (matchInfo) {
      return matchInfo.owner;
    }
    return null;
  },

  getLeaderboard(members) {
    members.sort(compareScore);
    return [...members];
  },

  async joinMatch(userId, role, roomId, slideId, group = null) {
    let matchInfo = matches.get(roomId);
    let joinedUser = null;
    // co-owner or member hit:
    if (
      matchInfo &&
      userId !== matchInfo.owner &&
      ((role === ROLE.member && !(await isGroupMember(userId, matchInfo))) ||
        (role === ROLE.co_owner && !(await isGroupCoOwner(userId, matchInfo))))
    ) {
      return null;
    }
    let userShortInfoList = [];
    if (!matchInfo) {
      switch (role) {
        // if userId has present permission and not init match:
        case ROLE.owner:
          {
            const questions = await getQuestionsInRoom(roomId);
            if (!questions) {
              return null;
            }

            const oldComments = await getOldComments(roomId);
            const oldQuestions = await getOldQuestions(roomId);

            matchInfo = initMatch(
              roomId,
              userId,
              questions,
              slideId,
              group,
              oldComments,
              oldQuestions
            );
            userShortInfoList = await getShortUserInfoSubmittedChoice(
              questions
            );
            matches.set(roomId, matchInfo);

            console.log("init new match");
          }
          break;
        // waiting for owner host to join
        default:
          SocketModel.sendEvent(
            userId,
            EventModel.CLOSE_REASON,
            EventModel.REASON_WAITING_FOR_HOST
          );
          return null;
      }
    }
    // Update joinned user
    else if (
      userId !== matchInfo.owner &&
      !matchInfo.members.find((member) => member.id === userId) &&
      role === ROLE.member
    ) {
      joinedUser = {
        id: userId,
        picture: "",
        name: userId,
        score: 0
      };
      matchInfo.members.push(joinedUser);
    } else if (
      userId !== matchInfo.owner &&
      !matchInfo.coOwners.find((coOwner) => coOwner.id === userId) &&
      role === ROLE.co_owner
    ) {
      const newCoOwner = {
        id: userId,
        picture: "",
        name: userId
      };
      matchInfo.coOwners.push(newCoOwner);
    }
    updateJoinedMemberList(matchInfo, role, userId);
    // join self hosted presentation:
    if (userId === matchInfo.owner && role !== ROLE.owner) {
      SocketModel.sendEvent(
        userId,
        EventModel.CLOSE_REASON,
        EventModel.REASON_SELF_HOSTED_PRESENTATION
      );
      return null;
    }
    // owner reconnecting...
    if (
      userId === matchInfo.owner &&
      role === ROLE.owner &&
      matchInfo.timeout
    ) {
      clearTimeout(matchInfo.timeout);
      matchInfo.timeout = null;

      const questions = await getQuestionsInRoom(roomId);
      if (!questions) {
        return null;
      }

      matchInfo = initMatch(
        roomId,
        userId,
        questions,
        matchInfo.curQues,
        matchInfo.groupId,
        matchInfo.comments,
        matchInfo.userQuestions,
        matchInfo.answers,
        matchInfo.members,
        matchInfo.coOwners,
        matchInfo.userShortInfoList
      );
      // userShortInfoList = await getShortUserInfoSubmittedChoice(questions);
      matches.set(roomId, matchInfo);
      console.log("delete timeout");
    }
    // console.log(matchInfo);
    // console.log(matchInfo.questions);

    // For slide has true_ans
    let data = [];
    // if (matchInfo.curState === STATE_LOBBY_CODE) {
    //   // get accessible data
    //   matchInfo.members.forEach((member) => {
    //     data.push({
    //       id: member.id,
    //       picture: member.picture,
    //       name: member.name
    //     });
    //   });
    // } else if (matchInfo.curState === STATE_LEADERBOARD_CODE) {
    //   data = this.getLeaderboard(matchInfo.members);
    //   if (data.length > 3) {
    //     data = [data[0], data[1], data[2]];
    //   }
    // }
    const curQuesRes = getQuestion(matchInfo.questions, matchInfo.curQues);
    const curQues = JSON.parse(JSON.stringify(curQuesRes));

    if (curQues && curQues.true_ans) {
      delete curQues.true_ans;
    }

    const questionIndex = hasQuestion(matchInfo.questions, matchInfo.curQues);
    const isEnd = questionIndex >= matchInfo.questions.length - 1;
    const isFirst = questionIndex === 0;

    if (role === ROLE.member) {
      delete curQues.choiceUserInfo;
      curQues.answers.forEach((ans) => {
        // eslint-disable-next-line no-param-reassign
        delete ans.choiceUserInfo;
      });
    }

    const result = {
      curState: matchInfo.curState,
      curQues,
      chatHistory: matchInfo.comments,
      quesHistory: hideUidVotedQues(
        assignUpVotedQuesOrNot(userId, matchInfo.userQuestions)
      ),
      data,
      joinedUser,
      isEnd,
      isFirst,
      isVoted: false
    };
    // if this is player
    if (role === ROLE.member && !isTesting) {
      const index = matchInfo.answers.findIndex(
        (question) => question.id === matchInfo.curQues
      );
      if (index !== -1) {
        const ans = matchInfo.answers[index];
        result.isVoted = ans.data.get(userId) !== null;
      }
    } else if (role !== ROLE.member) {
      // co-ower or owner
      if (userShortInfoList && userShortInfoList.length !== 0) {
        matchInfo.userShortInfoList = userShortInfoList;
      }
      result.userShortInfoList = matchInfo.userShortInfoList;
    }

    return result;
  },

  leaveLobby(userId, roomId, ws) {
    const matchInfo = matches.get(roomId);
    if (matchInfo /* && matchInfo.curState === STATE_LOBBY_CODE */) {
      let index = matchInfo.members.findIndex((member) => member.id === userId);
      if (index !== -1) {
        // remove in members
        matchInfo.members.splice(index, 1);
      }

      index = matchInfo.coOwners.findIndex((coOwner) => coOwner.id === userId);
      if (index !== -1) {
        // remove co-owner
        matchInfo.coOwners.splice(index, 1);
      }

      this.timeoutDeleteMatch(userId, roomId);
      SocketModel.sendBroadcastRoom(
        userId,
        roomId,
        EventModel.EXIT_ROOM,
        { id: userId },
        ws
      );
    }
  },

  timeoutDeleteMatch(userId, roomId, inSeconds = 120) {
    const matchInfo = matches.get(roomId);
    if (matchInfo && matchInfo.owner === userId) {
      const timeoutDelete = setTimeout(() => {
        matchInfo.coOwners.forEach((coOwner) => {
          SocketModel.removeSocketConn(coOwner.id);
        });
        matchInfo.members.forEach((member) => {
          SocketModel.removeSocketConn(member.id);
        });
        groupMap.delete(matchInfo.groupId);
        console.log("deleted groupId in groupMap");
        matches.delete(roomId);
        console.log("deleted roomId=", roomId);
      }, 1000 * inSeconds); // 120 seconds
      if (inSeconds !== 0) {
        matchInfo.timeout = timeoutDelete;
      }
    }
  },

  makeChoice(userId, name, email, roomId, choiceId, ws) {
    const matchInfo = matches.get(roomId);
    if (matchInfo /* && matchInfo.curState === STATE_LOBBY_CODE */) {
      const questionId = matchInfo.curQues;
      const questionIndex = hasQuestion(matchInfo.questions, questionId);
      if (questionIndex === -1) {
        return console.log("Khong co question nay");
      }

      const index = matchInfo.answers.findIndex(
        (question) => question.id === questionId
      );
      let ans = null;
      if (index === -1) {
        ans = { id: questionId, data: new HashMap() };
        matchInfo.answers.push(ans);
      }
      if (!ans) {
        ans = matchInfo.answers[index];
      }
      if (
        matchInfo.questions[questionIndex].type.toString() !==
        SLIDE_TYPE.multiple_choice.toString()
      ) {
        return;
      }
      const choiceIndex = isAnswerValid(
        matchInfo.questions[questionIndex].answers,
        choiceId
      );
      if (choiceIndex === -1) {
        return console.log("Khong co choiceId nay");
      }

      const isAnswered = ans.data.get(userId);
      if (isAnswered && !isTesting) {
        return console.log("Da answered roi");
      }
      const ts = getCurTimestampUTC();
      ans.data.set(userId, { choiceId, ts, name, email });
      matchInfo.questions[questionIndex].answers[choiceIndex].total += 1;

      matchInfo.questions[questionIndex].answers[
        choiceIndex
      ].choiceUserInfo.push({ id: userId, ts });
      SlideModel.addChoiceUid(questionId, roomId, choiceId, userId, ts);

      const curQues = getQuestion(matchInfo.questions, matchInfo.curQues);

      SocketModel.sendEvent(userId, EventModel.RECEIVE_CHOICE, {
        id: userId,
        choiceId,
        curQues
      });
      SocketModel.sendBroadcastRoom(userId, roomId, EventModel.RECEIVE_CHOICE, {
        id: userId,
        choiceId,
        name,
        email,
        ts
      });

      updateUserShortInfo(matchInfo, userId, name, email);
    }
  },

  isJoinSelfHostedPresentation(userId, roomId) {
    return matches.get(roomId)?.owner === userId;
  },

  nextSlide(userId, roomId, ws) {
    const matchInfo = matches.get(roomId);
    if (
      matchInfo &&
      (matchInfo.owner === userId ||
        matchInfo.coOwners.findIndex((coOwner) => coOwner.id === userId) !== -1)
    ) {
      const questionId = matchInfo.curQues;
      let questionIndex = hasQuestion(matchInfo.questions, questionId);
      if (questionIndex === -1) {
        return console.log("Khong co question nay");
      }

      if (questionIndex >= matchInfo.questions.length - 1) {
        return console.log("Da la cau hoi cuoi");
      }

      questionIndex += 1;
      const curQues = matchInfo.questions[questionIndex];
      matchInfo.curQues = curQues.id;

      if (
        !sendMoveSlideEventForEachUser(
          matchInfo,
          curQues,
          questionIndex,
          EventModel.RECEIVE_NEXT_SLIDE_EVENT
        )
      ) {
        SocketModel.sendBroadcastRoom(
          userId,
          roomId,
          EventModel.RECEIVE_NEXT_SLIDE_EVENT,
          {
            curState: matchInfo.curState,
            curQues,
            isEnd: questionIndex >= matchInfo.questions.length - 1
          },
          ws
        );
      }
    }
  },

  prevSlide(userId, roomId, ws) {
    const matchInfo = matches.get(roomId);
    if (
      matchInfo &&
      (matchInfo.owner === userId ||
        matchInfo.coOwners.findIndex((coOwner) => coOwner.id === userId) !== -1)
    ) {
      const questionId = matchInfo.curQues;
      let questionIndex = hasQuestion(matchInfo.questions, questionId);
      if (questionIndex === -1) {
        return console.log("Khong co question nay");
      }

      if (questionIndex <= 0) {
        return console.log("Da la cau hoi dau tien");
      }

      questionIndex -= 1;
      const curQues = matchInfo.questions[questionIndex];
      matchInfo.curQues = curQues.id;

      if (
        !sendMoveSlideEventForEachUser(
          matchInfo,
          curQues,
          questionIndex,
          EventModel.RECEIVE_PREV_SLIDE_EVENT
        )
      ) {
        SocketModel.sendBroadcastRoom(
          userId,
          roomId,
          EventModel.RECEIVE_PREV_SLIDE_EVENT,
          {
            curState: matchInfo.curState,
            curQues,
            isFirst: questionIndex === 0
          },
          ws
        );
      }
    }
  },

  doComment(userId, name, roomId, content) {
    return CommentModel.doComment(userId, name, content, matches.get(roomId));
  },

  doAsk(userId, name, roomId, content) {
    return QuestionModel.doAsk(userId, name, content, matches.get(roomId));
  },

  markQuesAnswered(userId, name, roomId, quesId) {
    return QuestionModel.doMarkAnsweredQues(
      userId,
      name,
      quesId,
      matches.get(roomId)
    );
  },

  doUpVoteQues(userId, roomId, quesId) {
    return QuestionModel.doUpVoteQues(userId, quesId, matches.get(roomId));
  },

  closeRoom(userId, socket, ws) {
    const roomId = SocketModel.getPresentationByUserId(userId);
    if (!roomId) {
      return;
    }
    const matchInfo = matches.get(roomId);
    if (matchInfo && matchInfo.owner === userId) {
      ws.to(roomId).emit(
        EventModel.CLOSE_REASON,
        EventModel.REASON_CLOSE_PREV_PRESENTATION
      );

      const ownerId = matchInfo.owner;
      this.timeoutDeleteMatch(userId, roomId, 0);
      SocketModel.removeSocketConn(ownerId);

      socket.emit(
        EventModel.CLOSE_PREV_PRESENTATION,
        EventModel.REASON_CLOSE_PREV_PRESENTATION
      );
    }
  }
};
