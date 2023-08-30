import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { BranchTypes } from "src/utils/types";

interface State {
  branch: BranchTypes["items"];
}

const initialState: State = {
  branch: [],
};

export const cacheResources = createSlice({
  name: "cached_datas",
  initialState,
  reducers: {
    cachedBranches: (state, { payload }: PayloadAction<BranchTypes>) => {
      state.branch = payload.items;
    },
  },
});

export const branchSelector = (state: RootState) => state.cache.branch;

export const { cachedBranches } = cacheResources.actions;
export default cacheResources.reducer;
