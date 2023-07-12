import { combineReducers } from "@reduxjs/toolkit";
import auth from "./authReducer";
import cache from "./cacheResources";

export default combineReducers({
  auth,
  cache,
});
