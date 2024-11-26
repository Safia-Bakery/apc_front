import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";

interface State {
  freezerState: {
    branch_id?: string | null;
    order_id?: null | string;
    message_id?: null | string;
  };
}

const initialState: State = {
  freezerState: {},
};

export const freezerReducer = createSlice({
  name: "collector-freezer",
  initialState,
  reducers: {
    getFreezerState: (
      state,
      { payload }: PayloadAction<State["freezerState"]>
    ) => {
      state.freezerState = payload;
    },
  },
});

export const freezerState = (state: RootState) => state.freezer.freezerState;

export const { getFreezerState } = freezerReducer.actions;

export default freezerReducer.reducer;
