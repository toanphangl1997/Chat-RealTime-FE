import { useRoutes } from "react-router-dom";
import Chat from "../pages/Chat";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const RootCustom = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
  ]);
};

export default RootCustom;
