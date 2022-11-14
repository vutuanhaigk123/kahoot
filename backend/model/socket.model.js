export default {
  sendMsg(ws, packet) {
    ws.send(JSON.stringify(packet));
  }
};
