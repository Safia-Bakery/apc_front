import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import {
  BranchTypes,
  BrigadaType,
  CategoryTypes,
  PermissionTypes,
  RoleTypes,
} from "src/utils/types";

interface State {
  permissions: PermissionTypes[];
  brigada: BrigadaType[];
  roles: RoleTypes[];
  categories: CategoryTypes["items"];
  branch: BranchTypes["items"];
}

const initialState: State = {
  permissions: [],
  brigada: [],
  roles: [],
  categories: [],
  branch: [],
};

export const cacheResources = createSlice({
  name: "cached_datas",
  initialState,
  reducers: {
    brigadaHandler: (state, { payload }: PayloadAction<BrigadaType[]>) => {
      state.brigada = payload;
    },
    cachedRoles: (state, { payload }: PayloadAction<RoleTypes[]>) => {
      state.roles = payload;
    },
    cachedCategories: (state, { payload }: PayloadAction<CategoryTypes>) => {
      state.categories = payload.items;
    },
    cachedBranches: (state, { payload }: PayloadAction<BranchTypes>) => {
      state.branch = payload.items;
    },
  },
});

export const permissionSelector = (state: RootState) => state.cache.permissions;
export const brigadaSelector = (state: RootState) => state.cache.brigada;
export const rolesSelector = (state: RootState) => state.cache.roles;
export const categorySelector = (state: RootState) => state.cache.categories;
export const branchSelector = (state: RootState) => state.cache.branch;

export const { brigadaHandler, cachedRoles, cachedCategories, cachedBranches } =
  cacheResources.actions;
export default cacheResources.reducer;
