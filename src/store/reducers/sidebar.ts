import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { MainPermissions, SidebarType } from "src/utils/types";
import { routes } from "src/utils/helpers";

interface State {
  sidebarItems?: SidebarType[];
  permissions?: { [key in MainPermissions]: boolean };
}

const initialState: State = {
  sidebarItems: [],
  permissions: undefined,
};

export const sidebarReducer = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    permissionHandler: (state, { payload }: PayloadAction<any[]>) => {
      const permissions = payload.reduce((acc, number) => {
        acc[number] = true;
        return acc;
      }, {});
      state.permissions = permissions;
    },
    sidebarItemsHandler: (state) => {
      const { permissions } = state;
      const filteredRoutes: SidebarType[] = [];

      routes.forEach((route) => {
        if (
          permissions?.[route?.screen] ||
          (route?.subroutes &&
            route.subroutes.some((subroute) => permissions?.[subroute.screen]))
        ) {
          const filteredSubroutes = route?.subroutes?.filter(
            (sub) => permissions?.[sub?.screen]
          );

          if (!!filteredSubroutes?.length) {
            filteredRoutes.push({
              ...route,
              subroutes: filteredSubroutes,
            });
          } else {
            filteredRoutes.push(route);
          }
        }
      });
      state.sidebarItems = filteredRoutes;
    },

    clearPermission: (state) => {
      state.permissions = undefined;
    },
  },
});

export const permissionSelector = (state: RootState) =>
  state.sidebar.permissions;
export const sidebatItemsSelector = (state: RootState) =>
  state.sidebar.sidebarItems;

export const { sidebarItemsHandler, clearPermission, permissionHandler } =
  sidebarReducer.actions;
export default sidebarReducer.reducer;
