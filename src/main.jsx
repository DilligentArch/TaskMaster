import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./Componenets/Home";
import Login from "./Componenets/Login";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import MainLayout from "./MainLayOut/MainLayout";
import AuthProvider from "./AuthProvider/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PrivateRoute><Home></Home></PrivateRoute>,
      },
      {
        path: "login",
        element: <Login />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
