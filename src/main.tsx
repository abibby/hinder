import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddItems } from "./pages/add-items.tsx";
import { Vote } from "./pages/vote.tsx";
import { Home } from "./pages/home.tsx";
import { Result } from "./pages/result.tsx";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/add",
    element: <AddItems />,
  },
  {
    path: "/vote",
    element: <Vote />,
  },
  {
    path: "/result",
    element: <Result />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
