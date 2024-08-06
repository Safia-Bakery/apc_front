import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { ToolItemType } from "@/utils/types";

interface State {
  selectedBranch?: { name: string; id: string };
  cart: { [key: string]: ToolItemType };
}

const initialState: State = {
  selectedBranch: undefined,
  cart: {},
};

export const webInventoryReducer = createSlice({
  name: "web-app-inventory",
  initialState,
  reducers: {
    selectBranch: (
      state,
      { payload }: PayloadAction<{ name: string; id: string }>
    ) => {
      state.selectedBranch = payload;
    },

    addItem: (state, { payload }: PayloadAction<ToolItemType>) => {
      if (!state.cart?.[payload.id])
        state.cart[payload.id] = { ...payload, count: 1 };
      else state.cart[payload.id].count += payload.count;
    },

    incrementSelected: (state, { payload }: PayloadAction<string>) => {
      state.cart[payload].count++;
    },
    decrementSelected: (state, { payload }: PayloadAction<string>) => {
      if (state.cart[payload].count > 1) {
        state.cart[payload].count--;
      } else {
        const updated = { ...state.cart };
        delete updated[payload]; // Remove the item with the given payload

        state.cart = updated;
      }
    },
    clearCart: (state) => {
      state.cart = {};
    },
  },
});

export const branchSelector = (state: RootState) =>
  state.webInventory.selectedBranch;

export const cartSelector = (state: RootState) => state.webInventory.cart;

export const {
  selectBranch,

  addItem,
  incrementSelected,
  decrementSelected,
  clearCart,
} = webInventoryReducer.actions;
export default webInventoryReducer.reducer;
