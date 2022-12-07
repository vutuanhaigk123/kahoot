/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import HashMap from "hashmap";
import EventModel from "./event.model.js";
import SlideModel from "./slide.model.js";
import SocketModel from "./socket.model.js";

// const questionSamples = [
//   {
//     id: "question1",
//     title: "Question 1: ... Answer = 1",
//     true_ans: "A",
//     answers: [
//       {
//         id: "A",
//         des: "Answer A"
//       },
//       {
//         id: "B",
//         des: "Answer B"
//       },
//       {
//         id: "C",
//         des: "Answer C"
//       },
//       {
//         id: "D",
//         des: "Answer D"
//       }
//     ]
//   },
//   {
//     id: "question2",
//     title: "Question 2: ... Answer = 1",
//     true_ans: "A",
//     answers: [
//       {
//         id: "A",
//         des: "Answer A"
//       },
//       {
//         id: "B",
//         des: "Answer B"
//       },
//       {
//         id: "C",
//         des: "Answer C"
//       },
//       {
//         id: "D",
//         des: "Answer D"
//       }
//     ]
//   }
// ];

const matches = new HashMap();
/*
    Structure:
    matches = {
      roomId: quiz room id,
      owner: owner id,
      timeout: timeoutDelete,
      curState: (lobby) || (leaderboard),
      curQues: question id,
      members: [{
        id: userId,
        picture: "picture link",
        name: "Name"
        score: 0
      }],
      questions: [{
        id: question id,
        title: "question 1: ...",
        answers: [{
          id: answer id,
          des: "This is an answer",
          total: 0
        }],
        true_ans: answer id
      }],
      answers: [{
        id: question id,
        data: HashMap<uid, answer id>
      }]
      
    }
*/

const STATE_LOBBY_CODE = 1;
const STATE_LEADERBOARD_CODE = 2;

function compareScore(memberA, memberB) {
  return memberA.score - memberB.score;
}

async function getQuestionsInRoom(roomId) {
  const ret = await SlideModel.getSlidesByPresentationId(roomId);
  return ret;
}

function initMatch(roomId, ownerId, questions, slideId) {
  const questionsTmp = [];
  questions.forEach((eachQuestion) => {
    const ansListOfQues = [];
    eachQuestion.answers.forEach((ans) => {
      ansListOfQues.push({
        id: ans._id,
        des: ans.des,
        total: ans.choiceUids.length
      });
    });
    questionsTmp.push({
      id: eachQuestion._id,
      question: eachQuestion.question,
      type: eachQuestion.type,
      answers: ansListOfQues
    });
  });
  // console.log(questionsTmp);
  return {
    roomId,
    timeout: null,
    members: [],
    curState: STATE_LOBBY_CODE,
    curQues: slideId,
    owner: ownerId,
    questions: questionsTmp,
    answers: []
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
  if (questions[index].answers.length === 0) {
    return null;
  }
  return questions[index];
}

export default {
  STATE_LOBBY: STATE_LOBBY_CODE,
  STATE_LEADERBOARD: STATE_LEADERBOARD_CODE,

  getLeaderboard(members) {
    members.sort(compareScore);
    return [...members];
  },

  async joinMatch(userId, hasPresentPermission, roomId, slideId) {
    let matchInfo = matches.get(roomId);
    let joinedUser = null;
    if (!matchInfo) {
      switch (hasPresentPermission) {
        // if userId has present permission and not init match:
        case true:
          {
            const questions = await getQuestionsInRoom(roomId);
            if (!questions) {
              return null;
            }
            matchInfo = initMatch(roomId, userId, questions, slideId);
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
      !matchInfo.members.find((member) => member.id === userId)
    ) {
      joinedUser = {
        id: userId,
        picture: "",
        name: userId,
        score: 0
      };
      matchInfo.members.push(joinedUser);
    }
    if (userId === matchInfo.owner && matchInfo.timeout) {
      clearTimeout(matchInfo.timeout);
      matchInfo.timeout = null;
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
    const curQues = getQuestion(matchInfo.questions, matchInfo.curQues);

    if (curQues && curQues.true_ans) {
      delete curQues.true_ans;
    }
    return {
      curState: matchInfo.curState,
      curQues,
      data,
      joinedUser
    };
  },

  leaveLobby(userId, roomId, ws) {
    const matchInfo = matches.get(roomId);
    if (matchInfo /* && matchInfo.curState === STATE_LOBBY_CODE */) {
      const index = matchInfo.members.findIndex(
        (member) => member.id === userId
      );
      if (index !== -1) {
        // remove in members
        matchInfo.members.splice(index, 1);
      }

      if (userId === matchInfo.owner) {
        const timeoutDelete = setTimeout(() => {
          matches.delete(roomId);
          console.log("deleted roomId=", roomId);
        }, 1000 * 120); // 120 seconds
        matchInfo.timeout = timeoutDelete;
      }
      SocketModel.sendBroadcastRoom(
        userId,
        roomId,
        EventModel.EXIT_ROOM,
        { id: userId },
        ws
      );
    }
  },

  makeChoice(userId, roomId, choiceId, ws) {
    const matchInfo = matches.get(roomId);
    if (matchInfo /* && matchInfo.curState === STATE_LOBBY_CODE */) {
      const questionId = matchInfo.curQues;
      const questionIndex = hasQuestion(matchInfo.questions, questionId);
      if (questionIndex === -1) {
        return console.log("Khong co question nay");
      }
      if (matchInfo.curQues !== questionId) {
        return console.log("Khac current question:");
      }
      const index = matchInfo.answers.findIndex(
        (answer) => answer.id === questionId
      );
      let ans = null;
      if (index === -1) {
        ans = { id: questionId, data: new HashMap() };
        matchInfo.answers.push(ans);
      }
      if (!ans) {
        ans = matchInfo.answers[index];
      }

      const choiceIndex = isAnswerValid(
        matchInfo.questions[questionIndex].answers,
        choiceId
      );
      if (choiceIndex === -1) {
        return console.log("Khong co choiceId nay");
      }

      // const isAnswered = ans.data.get(userId);
      // if (isAnswered) {
      //   return console.log("Da answered roi");
      // }
      ans.data.set(userId, choiceId);
      matchInfo.questions[questionIndex].answers[choiceIndex].total += 1;

      SocketModel.sendBroadcastRoom(
        userId,
        roomId,
        EventModel.RECEIVE_CHOICE,
        { id: userId, choiceId },
        ws
      );
    }
  }
};
