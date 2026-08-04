import React from "react";
import ReactDOM from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

// Ensure window.$_TSR is initialized so @tanstack/router-core's hydrate() never throws "Invariant failed"
if (typeof window !== "undefined") {
  const win = window as unknown as { $_TSR?: Record<string, unknown> };
  if (!win.$_TSR) {
    win.$_TSR = {
      router: {
        manifest: { routes: {} },
        matches: [],
        dehydratedData: {},
        lastMatchId: undefined,
      },
      h: () => {},
      e: () => {},
      c: () => {},
      p: (cb: () => void) => {
        try {
          cb();
        } catch {
          /* ignore */
        }
      },
      buffer: [],
    };
  }
}


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
    document,
    <React.StrictMode>
      <StartClient />
    </React.StrictMode>
  );
}

