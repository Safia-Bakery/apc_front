import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { CURRECT_VERSION } from "@/utils/version";
import { successToast } from "@/utils/toast";

interface State {
  version: string | null;
}

const initialState: State = {
  version: null,
};

export const versionCheckReducer = createSlice({
  name: "version_check",
  initialState,
  reducers: {
    versionHandler: (state) => {
      if (state.version !== CURRECT_VERSION) {
        successToast("version updated");
        window.location.reload();
        state.version = CURRECT_VERSION;
      }
    },
  },
});

export const versionSelector = (state: RootState) => state.version.version;

export const { versionHandler } = versionCheckReducer.actions;

export default versionCheckReducer.reducer;
