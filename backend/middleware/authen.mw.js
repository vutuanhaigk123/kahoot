/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import { parse } from "cookie";
import CookieModel from "../model/cookie.model.js";
import AuthModel from "../model/authen.model.js";
import EventModel from "../model/event.model.js";

const FIVE_MINS_LEFT = 5 * 60;

export default {
  async stopWhenNotLogon(req, res, next) {
    const accessTok = AuthModel.getAccessTokenFromReq(req);
    if (accessTok === null) {
      return res.json({
        code: 401,
        message: "No permission to access"
      });
    }

    let isExpired = false;
    const { code, data } = AuthModel.verifyAccessToken(accessTok, false);
    switch (code) {
      case AuthModel.INVALID_TOKEN:
        return res.json({
          code: 400,
          message: "Invalid access token"
        });
      case AuthModel.TOKEN_EXPIRED:
        isExpired = true;
      default:
        if (isExpired || data.exp - Date.now() / 1000 <= FIVE_MINS_LEFT) {
          // renew token
          const tokens = await AuthModel.renewAccessToken(
            data.uid,
            accessTok,
            CookieModel.getRefreshToken(req.cookies)
          );
          if (!tokens) {
            return res.json({
              code: 400,
              message: "Invalid access token"
            });
          }
          const { accessToken, refreshToken } = tokens;
          if (accessToken && refreshToken) {
            CookieModel.setToken(res, CookieModel.ACCESS_TOKEN, accessToken);
            CookieModel.setToken(res, CookieModel.REFRESH_TOKEN, refreshToken);
          } else if (isExpired) {
            return res.json({
              code: 400,
              message: "Invalid access token"
            });
          }
        }
        next();
    }
  },

  stopWhenLogon(req, res, next) {
    const authStr = req.headers.authorization;
    if (
      authStr ||
      CookieModel.getAccessToken(req.cookies) ||
      CookieModel.getRefreshToken(req.cookies)
    ) {
      return res.json({
        code: 200,
        message: "You logged in"
      });
    }
    next();
  },

  async wsStopWhenNotLogon(socket, next) {
    if (socket.handshake.headers.cookie) {
      const cookies = parse(socket.handshake.headers.cookie);
      if (
        cookies[CookieModel.ACCESS_TOKEN] &&
        cookies[CookieModel.REFRESH_TOKEN]
      ) {
        return next();
      }
    }
    socket.disconnect(true);
    return next(new Error("Client not logged in"));
  },

  async wsStopWhenInvalidQuery(socket, next) {
    if (
      socket.request._query &&
      socket.request._query.cmd !== "null" &&
      socket.request._query.room !== "null" &&
      socket.request._query.slide !== "null" &&
      (socket.request._query.cmd === EventModel.JOIN_ROOM ||
        socket.request._query.cmd === EventModel.CREATE_ROOM)
    ) {
      return next();
    }
    // socket.emit(EventModel.CLOSE_REASON, EventModel.REASON_NOT_FOUND_CONTENT);
    // socket.disconnect(true);
    return next(new Error("Client does not have valid query string"));
  }
};
