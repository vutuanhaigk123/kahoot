import mongoose from "mongoose";
import env from "./env";

export const connectionInfo = {
  host: env.DB_HOST,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASS,
  connectionUrl: `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`
};

export const { Schema } = mongoose;
export const { ObjectId } = mongoose;

const db = mongoose.createConnection(connectionInfo.connectionUrl);

export default db;
