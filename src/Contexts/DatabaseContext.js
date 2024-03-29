import React, { useContext, useState, useMemo } from "react";
import firebaseConfig from "../Firebase/firebaseConfig";

const DatabaseContext = React.createContext();
const UpdateDatabaseContext = React.createContext();
const LocalDatabaseContext = React.createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function useUpdateDatabase() {
  return useContext(UpdateDatabaseContext);
}

export default function DatabaseProvider({ children }) {
  const [database, setDatabase] = useState();
  const [useLocalDatabase] = useState(false);

  function updateDatabase(database) {
    setDatabase(database);
  }

  const firebase = require("firebase/app").default;

  // critical to put setDatabase as a memo because re-render will trigger infinite loop
  const firebaseMemo = useMemo(() => {
    if (firebase.apps.length === 0) {
      if (useLocalDatabase) {
        const firebaseApp = firebase
          .initializeApp({ databaseURL: `http://localhost:9000/?ns=is4261` })
          .database();
        setDatabase(firebaseApp);
      } else {
        // online database
        const firebaseApp = firebase.initializeApp(firebaseConfig).database();
        setDatabase(firebaseApp);
      }
    } else {
      firebase.app();
      setDatabase(firebase.app().database());
    }
  }, [database, firebaseConfig]);

  if (firebase.apps.length === 0) firebaseMemo();

  // this should always return value 1 because we initialise firebase .default
  // console.log("firebase.apps.length", firebase.apps.length);

  return (
    <LocalDatabaseContext.Provider value={useLocalDatabase}>
      <DatabaseContext.Provider value={database}>
        <UpdateDatabaseContext.Provider value={updateDatabase}>
          {children}
        </UpdateDatabaseContext.Provider>
      </DatabaseContext.Provider>
    </LocalDatabaseContext.Provider>
  );
}
