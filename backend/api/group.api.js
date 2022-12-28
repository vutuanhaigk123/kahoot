/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable import/extensions */

import express from "express";
import passport from "passport";
import AuthenMw from "../middleware/authen.mw.js";
import AuthenModel from "../model/authen.model.js";
import GroupModel from "../model/group.model.js";
import MailingModel from "../model/mailing.model.js";
import MatchModel from "../model/match.model.js";
import UserModel from "../model/user.model.js";
import { isValidRole } from "../utils/database.js";

const router = express.Router();

function mergeArrayObjects(users, grMembers) {
  const res = [];
  users.map((item) => {
    grMembers.forEach((element) => {
      if (item._id === element._id) {
        res.push({
          _id: item._id,
          role: element.role,
          ts: element.ts,
          name: item.name,
          email: item.email
        });
      }
    });
  });
  return res;
}

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { name } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    if (!ownerId) {
      return res.json({
        status: 400,
        message: "Invalid access token"
      });
    }
    if (!name || name.trim().length === 0) {
      return res.json({
        status: 400,
        message: "Invalid fields"
      });
    }
    const result = await GroupModel.createGroup(name, ownerId);
    if (!result) {
      return res.json({
        status: 500,
        message: "Internal error"
      });
    }
    GroupModel.addCreatedGroup(ownerId, result._id);
    return res.json({
      status: 0,
      info: {
        gId: result._id,
        name: result.name,
        members: [
          {
            _id: result.members[0]._id,
            role: result.members[0].role
          }
        ]
      }
    });
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { groupId } = req.body;
    const ownerId = AuthenModel.getUidFromReq(req);
    if (!ownerId) {
      return res.json({
        status: 400,
        message: "Invalid access token"
      });
    }
    if (!groupId || groupId.trim().length === 0) {
      return res.json({
        status: 400,
        message: "Invalid fields"
      });
    }

    const presentationId = MatchModel.getPresentationIdByGroupId(groupId);
    if (presentationId) {
      return res.json({
        status: 300,
        message: "There is a living presentation in group"
      });
    }

    if (!(await GroupModel.isGroupOwner(ownerId, groupId))) {
      return res.json({
        status: 401,
        message: "You do not have the group"
      });
    }
    GroupModel.delGroup(groupId, ownerId);
    return res.json({
      status: 0
    });
  }
);

router.get(
  "/created-groups",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { limit, page } = req.query;
    if (!limit || parseInt(limit) <= 0 || !page || parseInt(page) < 0) {
      return res.json({
        status: 400,
        message: "Missing fields"
      });
    }

    const ownerId = AuthenModel.getUidFromReq(req);
    const data = await GroupModel.getCreatedGroupIds(
      ownerId,
      parseInt(page),
      parseInt(limit)
    );
    if (data.groupIds.length <= 0) {
      return res.json({
        status: 0,
        data: null
      });
    }

    const groupIds = [];
    data.groupIds.forEach((element) => {
      groupIds.push(element.created_groups);
    });

    return res.json({
      status: 0,
      info: {
        total: data.total[0].count,
        groups: await GroupModel.getGroupsInfoByIds(groupIds)
      }
    });
  }
);

router.get(
  "/joined-groups",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { page, limit } = req.query;
    if (!limit || parseInt(limit) <= 0 || !page || parseInt(page) < 0) {
      return res.json({
        status: 400,
        message: "Missing fields"
      });
    }
    const ownerId = AuthenModel.getUidFromReq(req);

    const data = await GroupModel.getJoinedGroupIds(
      ownerId,
      parseInt(page),
      parseInt(limit)
    );
    if (data.groupIds.length <= 0) {
      return res.json({
        status: 0,
        data: null
      });
    }

    const groupIds = [];
    data.groupIds.forEach((element) => {
      groupIds.push(element.joined_groups);
    });

    return res.json({
      status: 0,
      info: {
        total: data.total[0].count,
        groups: await GroupModel.getGroupsInfoByIds(groupIds)
      }
    });
  }
);

router.get(
  "/join",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { id, token } = req.query;
    if (!id || !token) {
      return res.json({
        status: 422,
        message: "Missing fields"
      });
    }
    const uid = AuthenModel.getUidFromReq(req);
    const { data } = AuthenModel.verifyGroupInvitationToken(token);
    if (!data || !data.gId) {
      return res.json({ status: 400, message: "Invalid token" });
    }
    const group = await GroupModel.findByIdAndUid(data.gId, uid);
    if (group) {
      return res.json({ status: 400, message: "Invalid token" });
    }
    const result = await GroupModel.joinGroup(uid, data.gId);
    if (result) {
      return res.json({
        status: 0
      });
    }
    return res.json({
      status: 500,
      message: "Internal Error"
    });
  }
);

router.post(
  "/update-member",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { groupId, members } = req.body;
    let memberListJson = null;
    // const group = groupId ? await GroupModel.findById(groupId) : null;
    try {
      memberListJson = JSON.parse(members);
    } catch (err) {
      return res.json({
        status: 400,
        message: "Invalid data"
      });
    }
    if (!memberListJson || !memberListJson.length === 0) {
      console.log("ok");
      return res.json({ status: 400, message: "Invalid data" });
    }
    const uid = AuthenModel.getUidFromReq(req);
    const group = await GroupModel.canUpdateGroupInfo(uid, groupId);
    if (!group) {
      return res.json({ status: 401, message: "Do not have permission" });
    }
    const uidMap = new Map();
    for (let i = 0; i < memberListJson.length; i += 1) {
      const { id, role } = memberListJson[i];
      if (!id || !role || !isValidRole(role)) {
        return res.json({ status: 400, message: "Invalid data" });
      }
      uidMap.set(id, role);
    }
    const result = await GroupModel.updateMembersRole(uidMap, group);
    if (result) {
      return res.json({ status: 0 });
    }
    return res.json({ status: 500, message: "Internal Error" });
  }
);

router.post(
  "/send-invitation",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const { emailList, groupId } = req.body;
    let emailListJson = null;
    const uid = AuthenModel.getUidFromReq(req);
    const group = groupId
      ? await GroupModel.canUpdateGroupInfo(uid, groupId)
      : null;
    try {
      emailListJson = JSON.parse(emailList);
    } catch (err) {
      return res.json({
        status: 400,
        message: "Invalid data"
      });
    }
    if (!emailListJson || emailListJson.length === 0 || !group) {
      return res.json({
        status: 400,
        message: "Invalid data"
      });
    }
    for (let index = 0; index < emailListJson.length; index += 1) {
      const email = emailListJson[index];
      if (!UserModel.isValidEmail(email)) {
        return res.json({ status: 400, message: "Invalid data" });
      }
    }

    const userEmails = await GroupModel.filterEmailsNotInGroup(
      emailListJson,
      groupId
    );
    MailingModel.sendGroupInvitationEmail({
      groupName: group.name,
      emails: userEmails,
      token: group.inviteToken,
      groupId
    });
    return res.json({
      status: 0
    });
  }
);

router.get(
  "/:groupId",
  passport.authenticate("jwt", { session: false }),
  AuthenMw.renewAccessToken,
  async (req, res) => {
    const gId = req.params.groupId;
    const ownerId = AuthenModel.getUidFromReq(req);
    const group = await GroupModel.findByIdAndUid(gId, ownerId);

    if (!group) {
      return res.json({
        status: 0,
        info: null
      });
    }
    const uids = [];
    group.members.forEach((element) => {
      uids.push(element._id);
    });

    const usersInfo = await UserModel.getGeneralInfoByIds(uids, [
      "name",
      "email"
    ]);

    const membersInfo = mergeArrayObjects(usersInfo, group.members);

    return res.json({
      status: 0,
      info: {
        gId: group._id,
        name: group.name,
        inviteToken: group.inviteToken,
        members: membersInfo
      }
    });
  }
);

export default router;
