import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: Boolean(localStorage.getItem('isAuth')) || false,
  login: localStorage.getItem('login') || null,
  // password: localStorage.getItem,
  username: localStorage.getItem('user') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.login = action.payload.login;
      // state.password = action.payload.password;
      state.username = action.payload.username;
    },

    logout(state, action) {
      state.isAuth = false;
      state.login = '';
      // state.password = '';
      state.username = '';
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
