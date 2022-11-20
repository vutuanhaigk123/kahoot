import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {}
  },
  reducers: {
    login: (state, { payload }) => ({
      // Set user info
      ...state,
      user: { data: payload.info || payload.data, status: payload.status }
    }),
    logout: (state) => {
      // Handle logic code here
      return {
        ...state,
        user: {}
      };
    }
  }
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
