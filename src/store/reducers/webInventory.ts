import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { InventoryTools } from "@/utils/types";

interface State {
  selectedBranch?: { name: string; id: string };
  selectedTool?: { name: string; id: string };
  cart: { [key: string]: InventoryTools };
}

const initialState: State = {
  selectedBranch: undefined,
  selectedTool: undefined,
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
    selectTool: (
      state,
      { payload }: PayloadAction<{ name: string; id: string }>
    ) => {
      state.selectedTool = payload;
    },

    addItem: (state, { payload }: PayloadAction<InventoryTools>) => {
      if (!state.cart?.[payload.id])
        state.cart[payload.id] = { ...payload, count: 1 };
      else state.cart[payload.id].count += payload.count;
    },

    incrementSelected: (state, { payload }: PayloadAction<number>) => {
      state.cart[payload].count++;
    },
    decrementSelected: (state, { payload }: PayloadAction<number>) => {
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
export const toolSelector = (state: RootState) =>
  state.webInventory.selectedTool;

export const cartSelector = (state: RootState) => state.webInventory.cart;

export const {
  selectBranch,
  selectTool,
  addItem,
  incrementSelected,
  decrementSelected,
  clearCart,
} = webInventoryReducer.actions;
export default webInventoryReducer.reducer;
