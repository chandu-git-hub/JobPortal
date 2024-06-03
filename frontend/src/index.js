import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FileProvider } from "./lib/FileContext.js";

ReactDOM.render(
  <React.StrictMode>
    <FileProvider>
      <App />
    </FileProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

