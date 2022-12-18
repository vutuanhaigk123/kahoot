import { createSlice } from "@reduxjs/toolkit";

// {
//   chatHistory;
//   curQues;
//   curState;
//   quesHistory;
// }

const socketPlayerSlice = createSlice({
  name: "socket",
  initialState: {},
  reducers: {
    setSocket: (state, { payload }) => {
      return { ...state, ...payload };
    },
    setQuesHistory: (state, { payload }) => ({
      ...state,
      quesHistory: { ...payload }
    }),
    clearSocket: () => ({})
  }
});

// Action creators are generated for each case reducer function
export const { setSocket, setQuesHistory, clearSocket } =
  socketPlayerSlice.actions;

export default socketPlayerSlice.reducer;
