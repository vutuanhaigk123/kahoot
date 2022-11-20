/* eslint-disable import/extensions */
import mongoose from "mongoose";
import env from "./env.js";

export const connectionInfo = {
  host: env.DB_HOST,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASS,
  connectionUrl: `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`
};

export const STATUS_ACCOUNT = {
  activated: 0,
  verifying: 1,
  block: 2
};

export const ROLE = {
  owner: 0,
  co_owner: 1,
  member: 2,
  kick: -1
};

export function isValidRole(role) {
  switch (role) {
    case ROLE.owner:
    case ROLE.co_owner:
    case ROLE.member:
    case ROLE.kick:
      return true;

    default:
      return false;
  }
}

export function getNewObjectId() {
  return new mongoose.Types.ObjectId();
}

export function toObjectId(objIdStr) {
  return mongoose.Types.ObjectId(objIdStr);
}

export const { Schema } = mongoose;
export const { ObjectId } = mongoose;

const db = mongoose.createConnection(connectionInfo.connectionUrl);

export default db;
