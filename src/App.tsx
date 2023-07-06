import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useAppSelector } from "./redux/utils/types";
import { tokenSelector } from "./redux/reducers/authReducer";
import { useLayoutEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Routes from "src/components/Routes";
import { ToastContainer } from "react-toastify";
import { queryClient } from "src/utils/helpers";

const App = () => {
  const token = useAppSelector(tokenSelector);

  useLayoutEffect(() => {
    if (token) axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
