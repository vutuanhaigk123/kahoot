/* eslint-disable no-console */
/* eslint-disable import/extensions */
import { OAuth2Client } from "google-auth-library";
import env from "../utils/env.js";

const client = new OAuth2Client(env.GG_APP_ID);

export default {
  async verifyGoogleToken(credential) {
    let payload;
    let userId;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: env.GG_APP_ID
      });
      payload = ticket.getPayload();
      userId = payload.sub;
    } catch (e) {
      console.log(e);
    }
    if (payload && userId) {
      return {
        ...payload,
        userId
      };
    }
    return null;
  }
};
