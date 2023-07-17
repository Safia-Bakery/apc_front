import { combineReducers } from "@reduxjs/toolkit";
import auth from "./authReducer";
import cache from "./cacheResources";
import toggle from "./toggleReducer";

export default combineReducers({
  auth,
  cache,
  toggle,
});
