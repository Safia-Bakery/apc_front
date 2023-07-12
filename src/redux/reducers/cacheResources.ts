import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { BrigadaType, PermissionTypes } from "src/utils/types";

interface TreeTypes {
  [key: number]: string;
}
let idTree: TreeTypes;

interface State {
  permissionsObj: TreeTypes | null;
  permissions: PermissionTypes[];
  brigada: BrigadaType[];
}

const initialState: State = {
  permissionsObj: null,
  permissions: [],
  brigada: [],
};

export const cacheResources = createSlice({
  name: "cached_datas",
  initialState,
  reducers: {
    permissionHandler: (
      state,
      { payload }: PayloadAction<PermissionTypes[]>
    ) => {
      state.permissions = payload;
      if (payload.length) {
        const updatedObject = payload.reduce(
          (result, item) => {
            const { id, page_name } = item;
            result[id] = page_name;
            return result;
          },
          { ...idTree }
        );
        state.permissionsObj = updatedObject;
      }
    },
    brigadaHandler: (state, { payload }: PayloadAction<BrigadaType[]>) => {
      state.brigada = payload;
    },
  },
});

export const permissionSelector = (state: RootState) => state.cache.permissions;
export const treeSelector = (state: RootState) => state.cache.permissionsObj;
export const brigadaSelector = (state: RootState) => state.cache.brigada;

export const { permissionHandler, brigadaHandler } = cacheResources.actions;

export default cacheResources.reducer;
