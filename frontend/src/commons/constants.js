export const STATUS_ACCOUNT = {
  activated: 0,
  verifying: 1,
  block: 2
};

export const SUBMIT_STATUS = { ERROR: "error", SUCCESS: "success" };

export const googleScript = "https://accounts.google.com/gsi/client";

// Page routes
export const PAGE_ROUTES = {
  HOME: "/",
  LOGIN: "/sign-in",
  REGISTER: "/sign-up"
};

// API
export const API = {
  LOGOUT: "/api/authen/logout",
  LOGIN: "/api/authen/login",
  REGISTER: "/api/authen/register"
};
