import React, { useContext, useState, useEffect, useMemo } from "react";
import { useDatabase } from "./DatabaseContext";
import { getCurrentWeek } from "../Components/Timetable/utils";

const MyModulesContext = React.createContext();
const UpdateMyModulesContext = React.createContext();
const MyWeekContext = React.createContext();
const UpdateMyWeekContext = React.createContext();
const MaximumWeekContext = React.createContext();

export function useMyModules() {
  return useContext(MyModulesContext);
}

export function useUpdateMyModules() {
  return useContext(UpdateMyModulesContext);
}

export function useMyWeek() {
  return useContext(MyWeekContext);
}

export function useUpdateMyWeek() {
  return useContext(UpdateMyWeekContext);
}

export function useMaximumWeek() {
  return useContext(MaximumWeekContext);
}

export default function MyModulesProvider({ children }) {
  const database = useDatabase();
  const studentId = localStorage.getItem("studentId");
  const [myWeek, setMyWeek] = useState(
    useMemo(() => getCurrentWeek(), [new Date().getDay()])
  );

  // controls the maximumWeek to show during the semester to be 14
  // else, will show the current week as maximum week
  const initialMaximumWeek = useMemo(() => {
    if (getCurrentWeek() > 14) return getCurrentWeek();
    return 14;
  }, [new Date().getDay()]);

  const [maximumWeek] = useState(initialMaximumWeek);
  const [myModules, setMyModules] = useState([]);

  useEffect(() => {
    const eventsRef = database.ref(`Students/${studentId}/events`);
    eventsRef?.on(
      "value",
      function (events) {
        setMyModules(events?.val?.());
      },
      function (err) {
        console.error(err);
      }
    );
    return function cleanup() {
      eventsRef.off();
    };
  }, [studentId]);

  function updateMyModules(modules) {
    setMyModules(modules);
  }

  function updateMyWeek(week) {
    setMyWeek(week);
  }

  return (
    <MaximumWeekContext.Provider value={maximumWeek}>
      <MyModulesContext.Provider value={myModules}>
        <UpdateMyModulesContext.Provider value={updateMyModules}>
          <MyWeekContext.Provider value={myWeek}>
            <UpdateMyWeekContext.Provider value={updateMyWeek}>
              {children}
            </UpdateMyWeekContext.Provider>
          </MyWeekContext.Provider>
        </UpdateMyModulesContext.Provider>
      </MyModulesContext.Provider>
    </MaximumWeekContext.Provider>
  );
}
