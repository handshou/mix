import { React } from "react";
import {
  getModules,
  getStartEndTimeByWeek,
  generateRows,
  filterModules,
} from "./utils.js";

import "./timetable.css";

function createDay(name, modules) {
  return { name, modules };
}

function createModules(data) {
  return data.map((module) => {
    const { id, title, type } = module;
    return (
      <div key={id}>
        <div>{title}</div>
        <div>{type}</div>
      </div>
    );
  });
}

function pickColour(data) {
  // let colors = ["#00d5ff", "#008cff", "#00ffe5", "#00fbff"];
  // let random_color = colors[Math.floor(Math.random() * colors.length)];
  let colors = ["#FDDFDF", "#F0DEFD", "#DEFDE0", "#DEF3FD", "#FCF7DE"];
  let setColor = "#FFFFFF";

  data.forEach((module) => {
    const { type } = module;
    if (type.includes("Lecture")) {
      setColor = colors[0];
    } else if (type.includes("Tutorial")) {
      setColor = colors[1];
    } else if (type == "Private") {
      setColor = colors[2];
    } else {
      setColor = colors[3];
    }
  });
  return setColor;
}

export default function Timetable(props) {
  let { weekNumber = 1, timetableData, children } = props;
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
          display: "grid",
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
                  <td
                    key={`${cell.id}-${i}`}
                    align="center"
                    style={{ backgroundColor: pickColour(cell) }}
                  >
                    {createModules(cell)}
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
