import { createSlice } from "@reduxjs/toolkit";

const presentaionSlice = createSlice({
  name: "group",
  initialState: {},
  reducers: {
    setGroup: (state, { payload }) => ({ ...state, ...payload }),
    clearGroup: () => ({})
  }
});

// Action creators are generated for each case reducer function
export const { setGroup, clearGroup } = presentaionSlice.actions;

export default presentaionSlice.reducer;
