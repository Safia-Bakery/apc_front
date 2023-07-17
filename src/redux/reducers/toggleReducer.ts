import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";

interface State {
  sidebarToggler: boolean;
}

const initialState: State = {
  sidebarToggler: false,
};

export const toggleReducer = createSlice({
  name: "toggler",
  initialState,
  reducers: {
    sidebarHandler: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarToggler = payload;
    },
  },
});

export const toggleSidebar = (state: RootState) => state.toggle.sidebarToggler;

export const { sidebarHandler } = toggleReducer.actions;
export default toggleReducer.reducer;
