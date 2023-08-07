import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { Order } from "src/utils/types";
import { FileItem } from "src/components/FileUpload";

interface State {
  sidebarToggler: boolean;
  selectedBrigada?: Order["brigada"];
  photoReport?: FileItem[];
}

const initialState: State = {
  sidebarToggler: false,
  selectedBrigada: undefined,
  photoReport: undefined,
};

export const toggleReducer = createSlice({
  name: "toggler",
  initialState,
  reducers: {
    sidebarHandler: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarToggler = payload;
    },
    selectBrigada: (state, { payload }: PayloadAction<Order["brigada"]>) => {
      state.selectedBrigada = payload;
    },

    uploadReport: (
      state,
      { payload }: PayloadAction<FileItem[] | undefined>
    ) => {
      if (payload) {
        state.photoReport = payload;
      }
    },
  },
});

export const toggleSidebar = (state: RootState) => state.selects.sidebarToggler;
export const reportImgSelector = (state: RootState) =>
  state.selects.photoReport;
export const selectedBrigadaSelector = (state: RootState) =>
  state.selects.selectedBrigada;

export const { sidebarHandler, selectBrigada, uploadReport } =
  toggleReducer.actions;
export default toggleReducer.reducer;
