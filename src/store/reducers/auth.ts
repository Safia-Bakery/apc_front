import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { clearPermission } from "./sidebar";
import { queryClient } from "@/utils/helpers";

interface State {
  token: string | null;
  link: string;
}

const initialState: State = {
  token: null,
  link: "/home",
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutHandler: (state) => {
      state.token = null;
      clearPermission();
      window.location.reload();

      setTimeout(() => {
        queryClient.removeQueries();
      }, 500);

      const { pathname, search } = window.location;
      if (pathname.includes("login") || pathname === "/") state.link = "/home";
      else state.link = pathname + search;
    },
    loginHandler: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export const tokenSelector = (state: RootState) => state.auth.token;
export const linkSelector = (state: RootState) => state.auth.link;

export const { loginHandler, logoutHandler } = authReducer.actions;

export default authReducer.reducer;
