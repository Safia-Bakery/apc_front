import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/rootConfig.ts";
import BaseAPIClient from "./api/axiosConfig.ts";
import Loading from "./components/Loader/index.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/helpers.ts";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

// export const baseURL = "https://api.service.safiabakery.uz";
export const baseURL = "http://10.0.0.133:8000";
dayjs.extend(utc);
dayjs.extend(timezone);

export default new BaseAPIClient(baseURL, store);

let container: any = null;

document.addEventListener("DOMContentLoaded", function (event) {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);
    root.render(
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading absolute />}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <ToastContainer autoClose={600} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    );
  }
});
