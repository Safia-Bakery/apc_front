import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import selects from "./selects";
import sidebar from "./sidebar";

export default combineReducers({
  auth,
  selects,
  sidebar,
});
