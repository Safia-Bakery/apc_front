import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";

interface State {
  sidebarToggler: boolean;
  selectedBrigada?: { id: number; name: string; order: string | number };
}

const initialState: State = {
  sidebarToggler: false,
  selectedBrigada: undefined,
};

export const toggleReducer = createSlice({
  name: "toggler",
  initialState,
  reducers: {
    sidebarHandler: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarToggler = payload;
    },
    selectBrigada: (
      state,
      {
        payload,
      }: PayloadAction<{ id: number; name: string; order: number | string }>
    ) => {
      state.selectedBrigada = payload;
    },
  },
});

export const toggleSidebar = (state: RootState) => state.toggle.sidebarToggler;
export const selectedBrigadaSelector = (state: RootState) =>
  state.toggle.selectedBrigada;

export const { sidebarHandler, selectBrigada } = toggleReducer.actions;
export default toggleReducer.reducer;
