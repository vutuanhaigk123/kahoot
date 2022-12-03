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
  PRESENT_OWNER: "/presentation/owner/id",
  PRESENT_PLAYER: "/presentation/id",
  SLIDES: "/slides",
  SLIDES_EDIT: "/slides/:id"
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
  RE_SEND_VERIFY_EMAIL: "/api/authen/send-verify-link"
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
