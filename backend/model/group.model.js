/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import Group from "../schemas/groupsSchema.js";
import UserGroups from "../schemas/user_groupSchema.js";
import { getNewObjectId, ROLE, toObjectId } from "../utils/database.js";
import authenModel from "./authen.model.js";
import UserModel from "./user.model.js";

async function saveUserGroupsObj(userGroup) {
  try {
    const res = await userGroup.save();
    return res;
  } catch (err) {
    console.log("group.model.js\n", err);
    return null;
  }
}

function isValidRole(role) {
  switch (role) {
    case ROLE.owner:
    case ROLE.co_owner:
    case ROLE.member:
      return true;
    default:
      return false;
  }
}

// page value from 0
function toSkipValue(page, limit) {
  return page <= 0 ? 0 : page * limit;
}

async function getUserGroupsPage(
  uid,
  page,
  limit,
  conditions,
  unwind,
  projects
) {
  const skipValue = toSkipValue(page, limit);
  console.log(skipValue);
  const result = await UserGroups.aggregate([
    {
      $match: conditions
    },
    {
      $unwind: unwind
    },
    {
      $facet: {
        groupIds: [
          { $project: projects },
          { $skip: skipValue },
          { $limit: limit }
        ],
        total: [{ $count: "count" }]
      }
    }
  ]);
  return result[0];
}

async function getMemberIdsInGroup(uids, gId) {
  const resArr = await Group.aggregate([
    {
      $unwind: {
        path: "$members"
      }
    },
    {
      $match: {
        _id: gId,
        "members._id": { $in: uids }
      }
    },
    {
      $replaceRoot: {
        newRoot: "$members"
      }
    },
    { $project: { _id: 1 } }
  ]);
  const map = new Map();
  for (let index = 0; index < resArr.length; index += 1) {
    const { _id } = resArr[index];
    map.set(_id, true);
  }
  return map;
}

export default {
  async findById(id) {
    const groupRet = await Group.findById({ _id: id }).exec();
    return groupRet;
  },

  async findByIdAndUid(gId, uid) {
    const res = await Group.findOne({
      _id: gId,
      "members._id": uid
    });
    return res;
  },

  async createGroup(name, ownerId) {
    const gId = getNewObjectId();
    const group = new Group({
      _id: gId.toString(),
      name,
      inviteToken: authenModel.genPermanentGroupInvitationToken(gId.toString()),
      members: [{ _id: ownerId.toString(), role: ROLE.owner, ts: Date.now() }]
    });
    try {
      const ret = await group.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async addCreatedGroup(uid, gId) {
    const userGroup = await UserGroups.findById({ _id: uid });
    if (userGroup) {
      userGroup.created_groups.push(gId);
      const res = await saveUserGroupsObj(userGroup);
      return res;
    }
    const newUserGroup = new UserGroups({
      _id: uid,
      joined_groups: [],
      created_groups: [gId]
    });
    const res = await saveUserGroupsObj(newUserGroup);
    return res;
  },

  async addJoinedGroup(uid, gId) {
    const userGroup = await UserGroups.findById({ _id: uid });
    if (userGroup) {
      userGroup.joined_groups.push(gId);
      const res = await saveUserGroupsObj(userGroup);
      return res;
    }
    const newUserGroup = new UserGroups({
      _id: uid,
      joined_groups: [gId],
      created_groups: []
    });
    const res = await saveUserGroupsObj(newUserGroup);
    return res;
  },

  async setRole(gId, uid, role) {
    if (!isValidRole(role)) {
      return false;
    }
    const user = await UserModel.findById(uid);
    if (!user) {
      return false;
    }
    const group = await Group.findOne({
      _id: gId,
      "members._id": uid
    });
    if (!group) {
      return false;
    }
    const res = await Group.findOneAndUpdate(
      {
        _id: toObjectId(gId),
        "members._id": uid
      },
      {
        $set: {
          "members.$.role": role
        }
      }
    );
    if (!res) {
      return false;
    }
    return true;
  },

  async getCreatedGroupIds(uid, page, limit) {
    const res = await getUserGroupsPage(
      uid,
      page,
      limit,
      { _id: uid },
      "$created_groups",
      { _id: 0, created_groups: 1 }
    );
    return res;
  },

  async getJoinedGroupIds(uid, page, limit) {
    const res = await getUserGroupsPage(
      uid,
      page,
      limit,
      { _id: uid },
      "$joined_groups",
      { _id: 0, joined_groups: 1 }
    );
    return res;
  },

  async save(group) {
    try {
      const ret = await group.save();
      return ret;
    } catch (err) {
      console.log(err.code);
    }
    return null;
  },

  async getGroupsInfoByIds(groupIds) {
    const res = await Group.find()
      .where("_id")
      .in(groupIds)
      .select(["name"])
      .exec();
    return res;
  },

  async filterEmailsNotInGroup(emailList, gId) {
    const uidExistMap = await UserModel.findUidsByEmailList(emailList);
    if (!uidExistMap) {
      return emailList;
    }
    const alreadyMemberMap = await getMemberIdsInGroup(
      [...uidExistMap.values()],
      gId
    );
    const result = [];
    const addedMap = new Map();
    emailList.forEach((email) => {
      const uid = uidExistMap.get(email);
      if ((!uid || !alreadyMemberMap.get(uid)) && !addedMap.get(email)) {
        result.push(email);
        addedMap.set(email, true);
      }
    });
    return result;
  },

  async joinGroup(uid, gId) {
    const group = await this.findById(gId);
    if (!group) {
      return null;
    }
    group.members.push({ _id: uid, role: ROLE.member, ts: Date.now() });
    const isSaved = await this.save(group);
    if (!isSaved) {
      return null;
    }
    this.addJoinedGroup(uid, gId);
    return isSaved;
  },

  async canUpdateGroupInfo(uid, gId) {
    const result = await Group.findOne({
      _id: gId,
      members: {
        $elemMatch: { _id: uid, role: { $in: [ROLE.co_owner, ROLE.owner] } }
      }
    });
    return result;
  },

  async updateMembersRole(uidMap, group) {
    let needUpdate = false;
    const kickArr = [];
    for (let i = 0; i < group.members.length; i += 1) {
      const element = group.members[i];
      const role = uidMap.get(element._id);
      if (role && element.role !== ROLE.owner) {
        needUpdate = true;
        if (role === ROLE.kick) {
          kickArr.push(element._id);
          group.members.splice(i, 1);
          i -= 1;
        } else {
          element.role = role;
        }
      }
    }
    let result = true;
    if (needUpdate) {
      result = (await this.save(group)) !== null;
      console.log(kickArr);
      await UserGroups.updateMany(
        {
          _id: { $in: kickArr }
        },
        {
          $pullAll: {
            joined_groups: [group._id]
          }
        },
        { safe: true, multi: false }
      );
    }
    return result;
  }
};
