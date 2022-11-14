export default {
  JOIN_QUEUE: 1,
  EXIT_QUEUE: -1,

  JOIN_ROOM: 2,
  EXIT_ROOM: -2,
  CREATE_ROOM: 3,

  START_MATCH: 5,
  JOIN_MATCH: 4,
  EXIT_MATCH: -4,

  MAKE_MOVE: 100,

  RESP_OK: 0,
  KICK_CODE: -100,

  build_KICK_CODE_packet() {
    return {
      type: this.KICK_CODE,
      data: null
    };
  }
};
