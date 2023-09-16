import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import selects from "./selects";

export default combineReducers({
  auth,
  selects,
});
