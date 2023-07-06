import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer from "./reducers/reducers";

const persistConfig = {
  key: "apc",
  storage,
  whitelist: ["auth"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
