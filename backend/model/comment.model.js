export default {
  doComment(userId, name, content, matchInfo) {
    if (matchInfo && matchInfo.comments) {
      const data = {
        userId,
        text: content,
        ts: Date.now(),
        name
      };
      matchInfo.comments.push(data);
      return data;
    }
    return null;
  }
};
