import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {},
  reducers: {
    setSocket: (state, { payload }) => {
      console.log("🚀 ~ file: socketSlice.jsx:11 ~ payload", payload);
      return { ...state, ...payload };
    },
    clearSocket: (state) => ({ ...state })
  }
});

// Action creators are generated for each case reducer function
export const { setSocket, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
