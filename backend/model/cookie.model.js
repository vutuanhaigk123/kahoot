// import { response } from "express";

function getFieldFromCookies(cookies, field) {
  if (!cookies) {
    return null;
  }
  return cookies[`${field}`] ? cookies[`${field}`] : null;
}

export default {
  ACCESS_TOKEN: "access_tok",
  REFRESH_TOKEN: "refresh_tok",
  UID: "uid",

  getAccessToken(cookies) {
    return getFieldFromCookies(cookies, this.ACCESS_TOKEN);
  },

  getRefreshToken(cookies) {
    return getFieldFromCookies(cookies, this.REFRESH_TOKEN);
  },

  setToken(res, tokenName, tokenValue) {
    res.cookie(tokenName, tokenValue, { maxAge: 900000, httpOnly: true });
  },

  removeField(res, fieldName) {
    res.clearCookie(fieldName);
  },

  setField(res, fieldName, fieldValue) {
    res.cookie(fieldName, fieldValue, { maxAge: 900000, httpOnly: true });
  },

  getField(cookies, fieldName) {
    return getFieldFromCookies(cookies, fieldName);
  }
};
