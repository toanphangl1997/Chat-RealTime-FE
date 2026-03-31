import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { OnlineUsersProvider } from "./context/OnlineUsersContext.jsx";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <OnlineUsersProvider>
        <App />

        {/* GLOBAL TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={1700}
          newestOnTop
          pauseOnHover
          theme="dark"
        />
      </OnlineUsersProvider>
    </BrowserRouter>
  </StrictMode>,
);
