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
  PRESENT_PLAYER: "/presentation/join",
  SLIDES: "/slides",
  SLIDES_EDIT: "/slides/:id",
  SLIDES_PRESENT: "/presentation/owner/present",
  SLIDES_JOIN: "/presentation/join"
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
  UPDATE_PRESENTATION: "/api/presentation/update"
};

export const WS_CMD = {
  CREATE_ROOM_CMD: "5",
  JOIN_ROOM_CMD: "2"
};

export const WS_EVENT = {
  INIT_CONNECTION_EVENT: "1",
  RECEIVE_CHOICE_EVENT: "-3",
  SUBMIT_CHOICE_EVENT: "3"
};

export const WS_CLOSE = {
  CLOSE_REASON: "-999",
  REASON_HAS_NEW_CONNECTION: "-998",
  REASON_NOT_FOUND_CONTENT: "-997",
  REASON_INVALID_CMD: "-995",
  REASON_WAITING_FOR_HOST: "-994",
  REASON_SLIDE_HAS_NO_ANS: "-993"
};

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
  MULTIPLE_CHOICE: 0
};
