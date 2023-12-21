import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { Order } from "@/utils/types";
import { FileItem } from "@/components/FileUpload";

interface State {
  sidebarToggler: boolean;
  selectedBrigada?: Order["brigada"];
  photoReport?: FileItem[] | null;
}

const initialState: State = {
  sidebarToggler: false,
  selectedBrigada: undefined,
  photoReport: null,
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
      { payload }: PayloadAction<Order["brigada"] | undefined>
    ) => {
      state.selectedBrigada = payload;
    },

    uploadReport: (state, { payload }: PayloadAction<FileItem[] | null>) => {
      state.photoReport = payload;
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
