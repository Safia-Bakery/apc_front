import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { CURRECT_TG_VERSION, CURRECT_WEB_VERSION } from "@/utils/version";
import successToast from "@/utils/successToast";

interface State {
  tgVersion: string | null;
  wevVersion: string | null;
}

const initialState: State = {
  tgVersion: null,
  wevVersion: null,
};

export const versionCheckReducer = createSlice({
  name: "version_check",
  initialState,
  reducers: {
    webVersionHandler: (state) => {
      if (state.wevVersion !== CURRECT_WEB_VERSION) {
        successToast("version updated");
        window.location.reload();
        state.wevVersion = CURRECT_WEB_VERSION;
      }
    },
    tgVersionHandler: (state) => {
      if (state.tgVersion !== CURRECT_TG_VERSION) {
        successToast("version updated");
        window.location.reload();
        state.tgVersion = CURRECT_TG_VERSION;
      }
    },
  },
});

export const versionSelector = (state: RootState) => state.version.wevVersion;
export const tgVersionSelector = (state: RootState) => state.version.tgVersion;

export const { webVersionHandler, tgVersionHandler } =
  versionCheckReducer.actions;

export default versionCheckReducer.reducer;
