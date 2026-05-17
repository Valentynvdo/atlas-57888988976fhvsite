import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Ignore Chrome Extension and third-party script errors to prevent Webpack crash overlay
if (typeof window !== 'undefined') {
  window.addEventListener("error", (e) => {
    if (
      e.message && (
        e.message.includes("tronLink") ||
        e.message.includes("ResizeObserver") ||
        e.message.includes("Cannot assign to read only property")
      ) ||
      (e.filename && e.filename.includes("chrome-extension"))
    ) {
      e.stopImmediatePropagation();
    }
  });
  window.addEventListener("unhandledrejection", (e) => {
    if (e.reason && e.reason.stack && e.reason.stack.includes("chrome-extension")) {
      e.preventDefault();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
