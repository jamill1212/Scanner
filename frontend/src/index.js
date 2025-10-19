 
}  "name": "frontend",https://github.com/jamill1212/Scanner/blob/main/frontend%2Fpackage.jsonhttps://github.com/jamill1212/Scanner/blob/main/frontend%2Fsrc%2Findex.css#L1-L137import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);https://github.com/jamill1212/Scanner/blob/main/frontend%2Fsrc%2Findex.js#L1-L11 matrix:
   node-version: [18.x]
 - uses: actions/checkout@v4
 - name: Use Node.js ${{ matrix.node-version }}
   with:
     node-version: ${{ matrix.node-version }}
     cache: 'yarn'
 - name: Install root deps
   run: yarn install --frozen-lockfile
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
