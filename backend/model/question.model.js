export default {
  doAsk(userId, name, content, matchInfo) {
    if (matchInfo && matchInfo.userQuestions) {
      const data = {
        userId,
        content,
        ts: Date.now(),
        name
      };
      matchInfo.userQuestions.push(data);
      return data;
    }
    return null;
  }
};
