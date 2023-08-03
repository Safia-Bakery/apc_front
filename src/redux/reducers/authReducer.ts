import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { Screens } from "src/utils/types";

interface State {
  token: string | null;
  me: {
    id: number;
    username: string;
    role?: string;
    full_name: string;
    permissions: {
      [key in Screens]: boolean;
    };
  } | null;
}

const initialState: State = {
  token: null,
  me: null,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutHandler: () => {
      // state.me = null;
      // state.token = null;
      localStorage.clear();
    },

    loginHandler: (state, { payload }) => {
      state.token = payload;
    },

    roleHandler: (state, { payload }) => {
      state.me = payload;
      if (payload.permissions === "*" && state.me) {
        const resultObject = Object.keys(Screens).reduce((acc: any, key) => {
          acc[key] = true;
          return acc;
        }, {});
        state.me.permissions = resultObject;
      }
    },
  },
});

export const tokenSelector = (state: RootState) => state.auth.token;
export const roleSelector = (state: RootState) => state.auth.me;

export const { loginHandler, logoutHandler, roleHandler } = authReducer.actions;

export default authReducer.reducer;
