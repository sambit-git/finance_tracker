import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (!action.payload) {
        state.user = null;
        localStorage.removeItem("token");
      } else {
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      }
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
