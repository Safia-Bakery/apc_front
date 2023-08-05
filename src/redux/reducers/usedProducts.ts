import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { CartProducts, ToolsEarchType } from "src/utils/types";

interface State {
  products: CartProducts[];
  product?: CartProducts;
}

const initialState: State = {
  products: [],
  product: undefined,
};

export const usedProducts = createSlice({
  name: "used_products",
  initialState,
  reducers: {
    setProduct: ({ products }, { payload }: PayloadAction<CartProducts>) => {
      let actualIndex = -1;
      const checker = products.find((item, index) => {
        if (payload.id === item.id) {
          actualIndex = index;
          return true;
        }
        return false;
      });
      if (!checker) {
        products.push(payload);
      } else {
        const updated = [...(products || [])];
        checker.count = checker.count + 1;
        updated[actualIndex] = checker;
        products = updated;
      }

      // if(state.products?.includes(payload.id))
    },
  },
});

export const itemsSelector = (state: RootState) => state.usedProducts.products;

export const { setProduct } = usedProducts.actions;

export default usedProducts.reducer;
