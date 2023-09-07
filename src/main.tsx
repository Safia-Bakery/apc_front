import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/rootConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseAPIClient from "./api/axiosConfig.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/helpers.ts";
import { BrowserRouter } from "react-router-dom";

export const baseURL = "https://backend.service.safiabakery.uz";
// export const baseURL = "http://10.0.3.238:8000";
// todo comment
export default new BaseAPIClient(baseURL, store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
