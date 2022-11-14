import dotenv from "dotenv";

dotenv.config();

const envVar = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  SECRET_APP: process.env.SECRET_APP,
  PORT: process.env.PORT,
  EXP_TOK_TIME: process.env.EXP_TOK_TIME,
  EXP_TOK_LONG_TIME: process.env.EXP_TOK_LONG_TIME,

  DOMAIN: process.env.DOMAIN,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_SECRET: process.env.FB_SECRET,
  FB_CALLBACK_URL: process.env.DOMAIN + process.env.FB_CALLBACK_URL,
  GG_APP_ID: process.env.GG_APP_ID,
  GG_SECRET: process.env.GG_SECRET,
  GG_CALLBACK_URL: process.env.DOMAIN + process.env.GG_CALLBACK_URL
};

export default envVar;
