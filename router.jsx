import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./src/pages/Chat";
import Login from "./src/pages/Login";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/chat", element: <Chat /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
