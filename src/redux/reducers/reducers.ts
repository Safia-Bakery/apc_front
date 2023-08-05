import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import cache from "./cache";
import toggle from "./toggle";
import usedProducts from "./usedProducts";

export default combineReducers({
  auth,
  cache,
  toggle,
  usedProducts,
});
