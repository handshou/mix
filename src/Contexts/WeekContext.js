import React, { useContext, useState, useMemo } from "react";
import { getCurrentWeek } from "../Components/Timetable/utils";

const WeekContext = React.createContext();

export function useMaximumWeek() {
  return useContext(WeekContext);
}

export default function WeekProvider({ children }) {
  // controls the maximumWeek to show during the semester to be 14
  // else, will show the current week as maximum week
  const initialMaximumWeek = useMemo(() => {
    if (getCurrentWeek() > 14) return getCurrentWeek();
    return 14;
  }, [new Date().getDay()]);

  const [maximumWeek] = useState(initialMaximumWeek);

  return (
    <WeekContext.Provider value={maximumWeek}>{children}</WeekContext.Provider>
  );
}
