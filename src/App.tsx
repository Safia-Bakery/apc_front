import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Routes from "src/components/Routes";
import { ToastContainer } from "react-toastify";
import { queryClient } from "src/utils/helpers";

const App = () => {
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
