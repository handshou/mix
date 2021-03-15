import { React } from "react";

import "./timetable.css";

function getModules(data) {
  try {
    const baseDate = makeDate("Jan 11 2021 0:00 GMT+8").getTime();
    const weekInMilliSeconds = 1000 * 3600 * 24 * 7;
    if (data)
      return data.map((d) => ({
        id: d.startTime,
        week: Math.floor((d.startTime - baseDate) / weekInMilliSeconds) + 1,
        title: d.eventName,
        type: d.eventType,
        startTime: String(makeDate(d.startTime).getHours())
          .padStart(2, "0")
          .concat(String(makeDate(d.startTime).getMinutes()).padEnd(2, "0")),
        endTime: String(makeDate(d.endTime).getHours())
          .padStart(2, "0")
          .concat(String(makeDate(d.endTime).getMinutes()).padEnd(2, "0")),
        day: makeDate(d.startTime).toLocaleString("en-us", { weekday: "long" }),
      }));
    return [];
  } catch (error) {
    throw new Error(error);
  }
}

function makeDate(date) {
  return new Date(date);
}

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

function getNextStartTime(currentTime, minutesInterval) {
  currentTime = parseInt(currentTime) + minutesInterval;
  let minutes = String(currentTime).slice(-2);
  if (parseInt(minutes) >= 60) {
    currentTime = parseInt(currentTime) - 60 + 100 + (minutes % 60);
  }
  return String(currentTime).padStart(4, "0");
}

function generateRows(startTime, endTime, minutesInterval, modules) {
  let result = [];
  let modules_result = [];

  function isStartTimeSlot(currentTime, moduleStartTime) {
    return currentTime === moduleStartTime;
  }

  function isMidTimeSlot(currentTime, moduleStartTime, moduleEndTime) {
    return currentTime > moduleStartTime && currentTime < moduleEndTime;
  }

  while (parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);
    if (modules) {
      // condition to check if module should be pushed
      let suitableModules = modules.filter(
        (m) =>
          isStartTimeSlot(startTime, m.startTime) ||
          isMidTimeSlot(startTime, m.startTime, m.endTime)
      );
      modules_result.push(suitableModules);
    }
    startTime = getNextStartTime(startTime, minutesInterval);
  }
  if (modules == null)
    // [startTime, + minutesInterval, ..., endTime]
    return result;
  if (modules) return modules_result;
}

function getStartEndTimeByWeek(allModules, weekNumber) {
  // default timings
  let startTime = "0800";
  let endTime = "1800";
  const weekModules = allModules.filter(
    (module) => parseInt(module.week) === parseInt(weekNumber)
  );
  weekModules.forEach((module) => {
    if (parseInt(module.startTime) < parseInt(startTime)) {
      startTime = module.startTime;
    }
    if (parseInt(module.endTime) > parseInt(endTime)) {
      endTime = module.endTime;
    }
  });
  return { startTime, endTime };
}

let TypeofEvents = [];
TypeofEvents.push("Testing");

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
  let { weekNumber = 1, timetableData } = props;
  weekNumber = parseInt(weekNumber);

  const modules = getModules(timetableData);
  const weekTime = getStartEndTimeByWeek(modules, weekNumber);
  const times = generateRows(weekTime.startTime, weekTime.endTime, 30, null);

  const mondayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Monday");
  const tuesdayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Tuesday");
  const wednesdayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Wednesday");
  const thursdayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Thursday");
  const fridayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Friday");
  const saturdayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Saturday");
  const sundayModules = getModules(timetableData)
    .filter((m) => m.week === weekNumber)
    .filter((m) => m.day === "Sunday");

  const mondayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    mondayModules
  );
  const tuesdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    tuesdayModules
  );
  const wednesdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    wednesdayModules
  );
  const thursdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    thursdayModules
  );
  const fridayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    fridayModules
  );
  const saturdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    saturdayModules
  );
  const sundayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    sundayModules
  );

  const days = [
    createDay("Monday", mondayArray),
    createDay("Tuesday", tuesdayArray),
    createDay("Wednesday", wednesdayArray),
    createDay("Thursday", thursdayArray),
    createDay("Friday", fridayArray),
    createDay("Saturday", saturdayArray),
    createDay("Sunday", sundayArray),
  ];

  return (
    <div style={{ display: "grid ", overflow: "auto" }}>
      <table className="nice-table" aria-label="customized table">
        <thead>
          <tr>
            <th>Day/Time</th>
            {times.map((time) => (
              <th align="center" key={time}>
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={`${day.name}-tr`}>
              <th key={`${day.name}-th`} className="tdays">
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
  );
}
