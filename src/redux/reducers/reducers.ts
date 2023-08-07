import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import cache from "./cache";
import selects from "./selects";

export default combineReducers({
  auth,
  cache,
  selects,
});
