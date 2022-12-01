import { createSlice } from "@reduxjs/toolkit";

// Structure
// data: {
//   id: null,
//   email: null,
//   name: null,
//   addr: null,
//   picture: null
// },
// token: {
//   accessToken: null,
//   refreshToken: null
// },
// provider: null,
// status: null

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {}
  },
  reducers: {
    login: (state, { payload }) => ({
      // Set user info
      ...state,
      user: {
        data: {
          ...state.user.data,
          id: payload.id,
          email: payload.email,
          name: payload.name,
          addr: payload.addr || null,
          picture: payload.picture || null
        },
        token: {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken
        },
        provider: payload.provider || null,
        status: payload.status
      }
    }),
    logout: (state) => ({
      ...state,
      user: {}
    }),
    update: (state, { payload }) => ({
      ...state,
      user: {
        ...state.user,
        data: { ...state.user.data, addr: payload.addr, name: payload.name },
        provider: payload.provider || null
      }
    })
  }
});

// Action creators are generated for each case reducer function
export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
