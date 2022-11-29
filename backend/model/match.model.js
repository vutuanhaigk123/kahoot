/* eslint-disable import/extensions */
/* eslint-disable no-console */
import HashMap from "hashmap";
import EventModel from "./event.model.js";
import SocketModel from "./socket.model.js";

const questionSamples = [
  {
    id: "question1",
    title: "Question 1: ... Answer = 1",
    true_ans: "A",
    answers: [
      {
        id: "A",
        des: "Answer A"
      },
      {
        id: "B",
        des: "Answer B"
      },
      {
        id: "C",
        des: "Answer C"
      },
      {
        id: "D",
        des: "Answer D"
      }
    ]
  },
  {
    id: "question2",
    title: "Question 2: ... Answer = 1",
    true_ans: "A",
    answers: [
      {
        id: "A",
        des: "Answer A"
      },
      {
        id: "B",
        des: "Answer B"
      },
      {
        id: "C",
        des: "Answer C"
      },
      {
        id: "D",
        des: "Answer D"
      }
    ]
  }
];

const matches = new HashMap();
/*
    Structure:
    matches = {
      roomId: quiz room id,
      owner: owner id,
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
          des: "This is an answer"
        }],
        true_ans: answer id
      }],
      answers: [{
        id: question id,
        data: HashMap<uid, {
          uid: user id,
          ans: answer id
        }>
      }]
      
    }
*/

const STATE_LOBBY_CODE = 1;
const STATE_LEADERBOARD_CODE = 2;

function compareScore(memberA, memberB) {
  return memberA.score - memberB.score;
}

// eslint-disable-next-line no-unused-vars
async function getQuestionsInRoom(roomId) {
  return questionSamples;
}

function initMatch(roomId, ownerId, questions) {
  return {
    roomId,
    members: [],
    curState: STATE_LOBBY_CODE,
    curQues: -1,
    owner: ownerId,
    questions,
    answers: []
  };
}

export default {
  STATE_LOBBY: STATE_LOBBY_CODE,
  STATE_LEADERBOARD: STATE_LEADERBOARD_CODE,

  getLeaderboard(members) {
    members.sort(compareScore);
    return [...members];
  },

  async joinMatch(userId, roomId) {
    let matchInfo = matches.get(roomId);
    let joinedUser = null;
    if (!matchInfo) {
      // TO_DO: if userId's ROLE is co-owner, owner: continue
      const questions = await getQuestionsInRoom(roomId);
      if (!questions) {
        return null;
      }
      matchInfo = initMatch(roomId, userId, questions);
      matches.set(roomId, matchInfo);
    } else if (
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
    // console.log(matchInfo);
    // console.log(matchInfo.questions);

    let data = [];
    if (matchInfo.curState === STATE_LOBBY_CODE) {
      // get accessible data
      matchInfo.members.forEach((member) => {
        data.push({
          id: member.id,
          picture: member.picture,
          name: member.name
        });
      });
    } else if (matchInfo.curState === STATE_LEADERBOARD_CODE) {
      data = this.getLeaderboard(matchInfo.members);
      if (data.length > 3) {
        data = [data[0], data[1], data[2]];
      }
    }

    return {
      curState: matchInfo.curState,
      curQues: matchInfo.curQues,
      data,
      joinedUser
    };
  },

  leaveLobby(userId, roomId, ws) {
    const matchInfo = matches.get(roomId);
    if (matchInfo && matchInfo.curState === STATE_LOBBY_CODE) {
      const index = matchInfo.members.findIndex(
        (member) => member.id === userId
      );
      if (index === -1) {
        return;
      }
      // remove in members
      matchInfo.members.splice(index, 1);

      SocketModel.sendBroadcastRoom(
        userId,
        roomId,
        EventModel.EXIT_ROOM,
        { id: userId },
        ws
      );
    }
  }
};
