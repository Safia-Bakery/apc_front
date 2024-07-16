import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";

interface State {
  selectedBranch?: { name: string; id: string };
  selectedTool?: { name: string; id: string };
}

const initialState: State = {
  selectedBranch: undefined,
  selectedTool: undefined,
};

export const webInventoryReducer = createSlice({
  name: "web-app-inventory",
  initialState,
  reducers: {
    selectBranch: (
      state,
      { payload }: PayloadAction<{ name: string; id: string }>
    ) => {
      state.selectedBranch = payload;
    },
    selectTool: (
      state,
      { payload }: PayloadAction<{ name: string; id: string }>
    ) => {
      state.selectedBranch = payload;
    },
  },
});

export const branchSelector = (state: RootState) =>
  state.webInventory.selectedBranch;
export const toolSelector = (state: RootState) =>
  state.webInventory.selectedTool;

export const { selectBranch, selectTool } = webInventoryReducer.actions;
export default webInventoryReducer.reducer;
