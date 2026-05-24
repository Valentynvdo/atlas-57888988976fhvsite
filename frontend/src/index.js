import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import "./i18n";
import App from "@/App";

// Ignore Chrome Extension and third-party script errors to prevent Webpack crash overlay

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
