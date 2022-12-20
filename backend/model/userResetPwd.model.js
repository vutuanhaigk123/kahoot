/* eslint-disable import/extensions */
import UserResetPwd from "../schemas/user_resetPwdSchema.js";
//  The new option returns the newly created document(if a new document is created)
// Since upsert creates a document if not finds a document, you don't need to create another one manuall
const options = { upsert: true, new: true, setDefaultsOnInsert: true };

export default {
  async findById(id) {
    const ret = await UserResetPwd.findById({ _id: id }).exec();
    return ret;
  },

  async saveToken(uid, token) {
    const ret = await UserResetPwd.findOneAndUpdate(
      { _id: uid },
      { token },
      options
    ).exec();
    return ret;
  },

  async delToken(uid) {
    const ret = await UserResetPwd.findOneAndDelete({ _id: uid }).exec();
    return ret;
  }
};
