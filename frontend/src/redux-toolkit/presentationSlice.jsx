import { createSlice } from "@reduxjs/toolkit";

const presentaionSlice = createSlice({
  name: "presentation",
  initialState: {},
  reducers: {
    set: (state, { payload }) => ({ ...state, ...payload }),
    clear: (state) => ({ ...state })
  }
});

// Action creators are generated for each case reducer function
export const { set, clear } = presentaionSlice.actions;

export default presentaionSlice.reducer;
