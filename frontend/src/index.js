 

 - name: Run frontend tests
   run: yarn --cwd frontend test --watchAll=false
 "^@/(.*)$": "<rootDir>/src/$1"
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
