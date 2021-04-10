import { React, useCallback } from "react";
import {
  getModules,
  getStartEndTimeByWeek,
  generateRows,
  filterModules,
} from "./utils.js";
import { TimetableModules } from "./TimetableModules";

import "./timetable.css";

function createDay(name, modules) {
  return { name, modules };
}

const filterPrivateEventType = (timetableData) => {
  return timetableData.filter((module) => {
    if (module != null && module.eventType)
      return module.eventType !== "Private";
    return true;
  });
};

export default function Timetable(props) {
  let {
    weekNumber = 1,
    timetableData: test,
    children,
    showPrivate = false,
  } = props;
  let timetableData = [];
  if (test) timetableData = Object.values(test).flat();
  if (!showPrivate) {
    timetableData = filterPrivateEventType(timetableData);
  }

  weekNumber = parseInt(weekNumber);

  // TimetableTimings
  const modules = getModules(timetableData);
  const weekTime = getStartEndTimeByWeek(modules, weekNumber);
  const times = generateRows(weekTime.startTime, weekTime.endTime, 30, null);
  // TimetableDays
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timetableDays = days.map((day) => {
    const dayArray = generateRows(
      weekTime.startTime,
      weekTime.endTime,
      30,
      filterModules(timetableData, weekNumber, day)
    );
    return createDay(day, dayArray);
  });

  return (
    <>
      {children}
      <div
        style={{
          display: "block",
          overflow: "auto",
          margin: "1em",
        }}
      >
        <table className="nice-table" aria-label="customized table">
          <thead>
            <tr>
              <th></th>
              {times.map((time) => (
                <th align="center" key={time}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableDays.map((day) => (
              <tr key={`${day.name}-tr`}>
                <th
                  key={`${day.name}-th`}
                  className="tdays"
                  style={{ textAlign: "center" }}
                >
                  {day.name}
                </th>
                {day.modules.map((cell, i) => (
                  <td key={`${cell.id}-${i}`} align="center">
                    {<TimetableModules data={cell} fullData={timetableData} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
