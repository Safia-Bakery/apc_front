import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/rootConfig.ts";
import BaseAPIClient from "./api/axiosConfig.ts";
import Loading from "./components/Loader/index.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export const baseURL = "https://api.service.safiabakery.uz";
// export const baseURL = "http://10.0.3.204:8000";
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default time zone for your application (e.g., 'Asia/Tashkent' for Uzbekistan)
dayjs.tz.setDefault("Asia/Tashkent");

export default new BaseAPIClient(baseURL, store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<Loading />}>
      <App />
    </PersistGate>
  </Provider>
);
