/* eslint-disable import/extensions */
import session from "express-session";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import fnGoogleStrategy from "passport-google-oauth";
import env from "../utils/env.js";

const GoogleStrategy = fnGoogleStrategy.OAuth2Strategy;

export default (app) => {
  app.use(
    session({
      secret: env.SECRET_APP,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      // Enable cookie secure = true when deploy
      cookie: {
        secure: false
      }
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: env.FB_APP_ID,
        clientSecret: env.FB_SECRET,
        callbackURL: "http://localhost:3001/api/authen/facebook/callback",
        profileFields: [
          "id",
          "displayName",
          "name",
          "email",
          "picture.type(large)"
        ]
      },
      async (accessToken, refreshToken, profile, done) => {
        // eslint-disable-next-line no-console
        console.log(profile);
        return done(null, { uid: 0 });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GG_APP_ID,
        clientSecret: env.GG_SECRET,
        callbackURL: "http://localhost:3001/api/authen/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        // eslint-disable-next-line no-console
        console.log(profile);
        return done(null, { uid: 0 });
      }
    )
  );
};
