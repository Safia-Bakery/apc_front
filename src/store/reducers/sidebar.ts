import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { Departments, SidebarType } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { sidebarRoutes } from "@/utils/routeObjs";

interface State {
  sidebarItems?: SidebarType[];
  permissions?: Set<any>;
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
      const permissions = new Set(payload);
      state.permissions = permissions;
    },
    sidebarItemsHandler: (state, { payload }: PayloadAction<[number[]]>) => {
      const { permissions } = state;
      const filteredRoutes: SidebarType[] = [];

      sidebarRoutes?.forEach((route) => {
        const updatedRoute = { ...route };
        updatedRoute.count = payload?.find((item) =>
          item[0] === Departments.APC
            ? item[1] === route.sphere_status
            : item[0] === route.department
        )?.[2];
        if (
          permissions?.has(updatedRoute?.screen) ||
          (updatedRoute?.subroutes &&
            updatedRoute.subroutes.some((subroute) =>
              permissions?.has(subroute.screen)
            ))
        ) {
          const filteredSubroutes = updatedRoute?.subroutes?.filter((sub) =>
            permissions?.has(sub?.screen)
          );

          if (!!filteredSubroutes?.length) {
            filteredRoutes.push({
              ...updatedRoute,
              subroutes: filteredSubroutes,
            });
          } else {
            filteredRoutes.push(updatedRoute);
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
