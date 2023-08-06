import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import {
  BranchTypes,
  BrigadaType,
  CategoryTypes,
  PermissionTypes,
  RoleTypes,
  UsersType,
} from "src/utils/types";

interface State {
  permissions: PermissionTypes[];
  brigada: BrigadaType[];
  roles: RoleTypes[];
  categories: CategoryTypes["items"];
  branch: BranchTypes["items"];
  users: UsersType[];
  selectedBrigada?: { id: number; name: string };
}

const initialState: State = {
  permissions: [],
  brigada: [],
  roles: [],
  categories: [],
  branch: [],
  users: [],
  selectedBrigada: undefined,
};

export const cacheResources = createSlice({
  name: "cached_datas",
  initialState,
  reducers: {
    brigadaHandler: (state, { payload }: PayloadAction<BrigadaType[]>) => {
      state.brigada = payload;
    },
    selectBrigada: (
      state,
      { payload }: PayloadAction<{ id: number; name: string }>
    ) => {
      state.selectedBrigada = payload;
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
    cachedUsers: (state, { payload }: PayloadAction<UsersType[]>) => {
      state.users = payload;
    },
    cachedPermissions: (
      state,
      { payload }: PayloadAction<PermissionTypes[]>
    ) => {
      state.permissions = payload;
    },
  },
});

export const permissionSelector = (state: RootState) => state.cache.permissions;
export const brigadaSelector = (state: RootState) => state.cache.brigada;
export const rolesSelector = (state: RootState) => state.cache.roles;
export const categorySelector = (state: RootState) => state.cache.categories;
export const branchSelector = (state: RootState) => state.cache.branch;
export const usersSelector = (state: RootState) => state.cache.users;
export const selectedBrigadaSelector = (state: RootState) =>
  state.cache.selectedBrigada;

export const {
  brigadaHandler,
  cachedRoles,
  cachedCategories,
  cachedBranches,
  cachedPermissions,
  cachedUsers,
  selectBrigada,
} = cacheResources.actions;
export default cacheResources.reducer;
