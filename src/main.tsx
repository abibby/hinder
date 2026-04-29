import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddItems } from "./pages/add-items.tsx";
import { Vote } from "./pages/vote.tsx";
import { Home } from "./pages/home.tsx";
import { Result } from "./pages/result.tsx";
import "./main.css";
import "./polyfill/crypto.randomUUID";
import { QR } from "./pages/qr.tsx";
import { QuickList, SelectQuickList } from "./pages/quick-list.tsx";
import { SharePopup } from "./components/share.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/quick",
    element: <SelectQuickList />,
  },
  {
    path: "/quick/:type",
    element: <QuickList />,
  },
  {
    path: "/qr",
    element: <QR />,
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
    <SharePopup />
  </React.StrictMode>
);

if ("virtualKeyboard" in navigator) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (navigator as any).virtualKeyboard.overlaysContent = true;
}
