import "./ssr-init";
import React from "react";
import ReactDOM from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter();

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  ReactDOM.hydrateRoot(
    rootElement!,
    <React.StrictMode>
      <StartClient />
    </React.StrictMode>
  );
}

