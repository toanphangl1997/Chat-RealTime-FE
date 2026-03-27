import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { OnlineUsersProvider } from "./context/OnlineUsersContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <OnlineUsersProvider>
      <App />
      </OnlineUsersProvider>
    </BrowserRouter>
  </StrictMode>
);
