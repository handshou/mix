import React from "react";

import ErrorBoundary from "./Components/ErrorBoundary";
import DatabaseContext from "./Contexts/DatabaseContext";
import Routes from "./Router/Routes";

import "./App.css";

function App() {
  return (
    <div>
      <ErrorBoundary>
        <DatabaseContext>
          <Routes />
        </DatabaseContext>
      </ErrorBoundary>
    </div>
  );
}

export default App;
