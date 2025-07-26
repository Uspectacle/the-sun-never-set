import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/variables.css";
import "./styles/globals.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
