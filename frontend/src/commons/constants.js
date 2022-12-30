export const STATUS_ACCOUNT = {
  activated: 0,
  verifying: 1,
  block: 2
};

export const SUBMIT_STATUS = { ERROR: "error", SUCCESS: "success" };

export const googleScript = "https://accounts.google.com/gsi/client";

let DOMAIN = process.env.REACT_APP_FRONTEND_DOMAIN_DEV;
if (!window.location.hostname.includes("localhost")) {
  DOMAIN = process.env.REACT_APP_BACKEND_DOMAIN;
}

// Page routes
export const PAGE_ROUTES = {
  BASE: DOMAIN,
  HOME: "/",
  LOGIN: "/sign-in",
  REGISTER: "/sign-up",
  VERIFY_EMAIL: "/mailing/verify-email",
  GROUP: "/group",
  PROFILE: "/profile",
  GROUP_DETAIL: "/group/:id",
  JOIN: "/group/join",
  PRESENTATION: "/presentaion",
  PRESENTATION_EDIT: "/presentaion/:id",
  PRESENT_OWNER: "/presentation/owner/present",
  PRESENT_CO_OWNER: "/presentation/co-owner/present",
  PRESENT_PLAYER: "/presentation/join",
  SLIDES: "/slides",
  SLIDES_EDIT: "/slides/:id",
  SLIDES_PRESENT: "/presentation/owner/present",
  SLIDES_JOIN: "/presentation/join",
  RESET_PASSWORD: "/reset-password"
};

// API
export const API = {
  LOGOUT: "/api/authen/logout",
  LOGIN: "/api/authen/login",
  REGISTER: "/api/authen/register",
  VERIFY_EMAIL: "/api/authen/verify",
  CREATE_GROUP: "/api/group/create",
  CREATED_GROUP: "/api/group/created-groups",
  JOINED_GROUP: "/api/group/joined-groups",
  PROFILE: "/api/user/profile",
  CHANGE_PASSWORD: "/api/user/password",
  GROUP_DETAIL: "/api/group",
  JOIN: "/api/group/join",
  GROUP_INVITE_EMAIL: "/api/group/send-invitation",
  MEMBER_UPDATE: "/api/group/update-member",
  RE_SEND_VERIFY_EMAIL: "/api/authen/send-verify-link",
  PRESENTATION_LIST: "/api/presentation",
  CREATE_PRESENTAION: "/api/presentation/create",
  DELETE_PRESENTAION: "/api/presentation/delete",
  CREATE_SLIDE: "/api/slide/create",
  UPDATE_SLIDE: "/api/slide/update",
  ADD_ANSWER: "/api/slide/answer/create",
  DELETE_ANSWER: "/api/slide/answer/delete",
  UPDATE_ANSWER: "/api/slide/answer/update",
  DELETE_SLIDE: "/api/slide/delete",
  UPDATE_PRESENTATION: "/api/presentation/update",
  PRESENTATION_LIST_COLLAB: "/api/presentation/colab",
  PRESENTATION_ADD_COLLAB: "/api/presentation/add-colab",
  PRESENTATION_DELETE_COLLAB: "/api/presentation/del-colab",
  FORGOT_PASSWORD: "/api/user/forgot-password",
  VALIDATE_RESET_PASSWORD: "/api/user/validate-reset-password",
  RESET_PASSWORD: "/api/user/reset-password",
  DELETE_GROUP: "/api/group/delete",
  UPDATE_SLIDE_CONTENT: "/api/slide/content/update"
};

export const WS_PATH = {
  GROUP: "/ws/group",
  MATCH: "/ws/match"
};

export const WS_CMD = {
  JOIN_AS_CO_OWNER: "0",
  CREATE_ROOM_CMD: "5",
  JOIN_ROOM_CMD: "2",
  SUBMIT_CHOICE_CMD: "3",
  NEXT_SLIDE_CMD: "4",
  PREV_SLIDE_CMD: "-4",
  SEND_CMT_CMD: "7",
  SEND_QUESTION_CMD: "8",
  UPVOTE_QUESTION_CMD: "9",
  MARK_QUESTION_ANSWERED_CMD: "10",
  CLOSE_PREV_PRESENTATION: "12"
};

export const WS_DATA = {
  ALLOW_CLOSE_PREV_PRESENTATION: "1",
  DENIED_CLOSE_PREV_PRESENTATION: "2"
};

export const WS_EVENT = {
  INIT_CONNECTION_EVENT: "1",
  RECEIVE_CHOICE_EVENT: "-3",

  RECEIVE_NEXT_SLIDE_EVENT: "6",
  RECEIVE_PREV_SLIDE_EVENT: "-6",

  RECEIVE_CMT_EVENT: "-7",
  RECEIVE_QUESTION_EVENT: "-8",

  RECEIVE_UPVOTE_QUESTION_EVENT: "-9",
  RECEIVE_MARK_QUES_ANSWERED_EVENT: "-10",

  GROUP_RECEIVE_PRESENTING_EVENT: "-11",

  RECEIVE_PREV_PRESENTATION: "-12"
};

export const WS_CLOSE = {
  CLOSE_REASON: "-999",
  REASON_HAS_NEW_CONNECTION: "-998",
  REASON_NOT_FOUND_CONTENT: "-997",
  REASON_INVALID_CMD: "-995",
  REASON_WAITING_FOR_HOST: "-994",
  REASON_SLIDE_HAS_NO_ANS: "-993",
  REASON_SELF_HOSTED_PRESENTATION: "-992",
  REASON_CLOSE_PREV_PRESENTATION: "-991"
};

export const SORT_BY = {
  TIME_ASKED_ASC: 1,
  TIME_ASKED_DESC: -1,
  TOTAL_VOTE_ASC: 2,
  TOTAL_VOTE_DESC: -2,
  ANSWERED: 3,
  UNANSWERED: -3
};

export const SORT_BY_ARR = [
  { name: "Time asked (Ascending)", value: SORT_BY.TIME_ASKED_ASC },
  { name: "Time asked (Descending)", value: SORT_BY.TIME_ASKED_DESC },
  { name: "Total vote (Ascending)", value: SORT_BY.TOTAL_VOTE_ASC },
  { name: "Total vote (Descending)", value: SORT_BY.TOTAL_VOTE_DESC },
  { name: "Answered (Filter)", value: SORT_BY.ANSWERED },
  { name: "Unanswered (Filter)", value: SORT_BY.UNANSWERED }
];

// Group role
export const ROLE = {
  owner: 0,
  co_owner: 1,
  member: 2,
  kick: -1
};

export const NUM_TO_ROLE = {
  0: "Owner",
  1: "Co-owner",
  2: "Member",
  "-1": "Kick"
};

export const questionType = {
  MULTIPLE_CHOICE: 0,
  HEADING: 1,
  PARAGRAPH: 2
};
