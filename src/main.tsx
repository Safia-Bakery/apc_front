import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/rootConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseAPIClient from "./api/axiosConfig.ts";

// export const baseURL = "https://backend.service.safiabakery.uz";
export const baseURL = "http://10.0.3.238:8000";
export default new BaseAPIClient(baseURL, store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>
);
