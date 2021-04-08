import React from "react";
import firebase from "firebase";

import DatabaseContext from "./Contexts/DatabaseContext";
import Routes from "./Router/Routes";

import "./App.css";

function App() {
  return (
    <div>
      <DatabaseContext>
        <Routes />
      </DatabaseContext>
    </div>
  );
}

export default App;
