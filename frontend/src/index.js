console.log("INDEX JS IS RUNNING");
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import "./i18n";
import App from "@/App";

import { HelmetProvider } from "react-helmet-async";

// Ignore Chrome Extension and third-party script errors to prevent Webpack crash overlay

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
