import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import selects from "./selects";
import sidebar from "./sidebar";
import webInventory from "./webInventory";
import freezer from "./freezer";

export default combineReducers({
  auth,
  selects,
  sidebar,
  webInventory,
  freezer,
});
