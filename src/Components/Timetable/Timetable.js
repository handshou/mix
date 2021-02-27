import { React } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EnterURL from "./EnterURL";
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import './timetable.css';
import {mock} from './mock';


// create time intervals (top row) - ok
// create row representing day - ok
// get mock data from api - ok
// filter mock data by week, and by day - ok

// tasks tonight
// 1 create row representing modules with time intervals separation - ok
// 1.1 create function for finding earliest, latest modules each week - ok
// 2 refactoring components into smaller files - ...
// 3 create a store to remember which week we are on (or check current day) - ..
// 4 create weekly timetables by week number - ...

function getModules(data) {
  const baseDate = makeDate('Jan 11 2021 0:00 GMT+8').getTime();
  const weekInMilliSeconds = 1000 * 3600 * 24 * 7;
  const weeklyData = data.map(d => ({
    week: Math.floor((d.startTime - baseDate) / weekInMilliSeconds) + 1,
    title: d.name,
    type: d.eventType,
    startTime: String(makeDate(d.startTime).getHours())
      .padStart(2, '0')
      .concat(String(makeDate(d.startTime).getMinutes()).padEnd(2, '0')),
    endTime: String(makeDate(d.endTime).getHours())
      .padStart(2, '0')
      .concat(String(makeDate(d.endTime).getMinutes()).padEnd(2, '0')),
    day: makeDate(d.startTime).toLocaleString('en-us', {weekday: 'long'}),
  }));
  return weeklyData;
}

function makeDate(date) {
  return new Date(date);
}

function createDay(name, modules) {
  return {name, modules};
}

function createModules(data) {
  return data.map(module => {
    const {title, type} = module;
    return (
      <>
        <div>{title}</div>
        <div>{type}</div>
      </>
    );
  });
}

function isStartTimeSlot(currentTime, moduleStartTime) {
  return currentTime === moduleStartTime;
}

function isMidTimeSlot(currentTime, moduleStartTime, moduleEndTime) {
  return currentTime > moduleStartTime && currentTime < moduleEndTime;
}

function getNextStartTime(currentTime, minutesInterval) {
  currentTime = parseInt(currentTime) + minutesInterval;
  let minutes = String(currentTime).slice(-2);
  if (parseInt(minutes) >= 60) {
    currentTime = parseInt(currentTime) - 60 + 100 + (minutes % 60);
  }
  return String(currentTime).padStart(4, '0');
}

function generateRows(startTime, endTime, minutesInterval, modules) {
  // startTime = "0800";
  // endTime = "2330";
  let result = [];
  let modules_result = [];

  while (parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);
    if (modules) {
      // condition to check if module should be pushed
      const suitableModules = modules.filter(
        m =>
          isStartTimeSlot(startTime, m.startTime) ||
          isMidTimeSlot(startTime, m.startTime, m.endTime),
      );
      modules_result.push(suitableModules);
    }
    startTime = getNextStartTime(startTime, minutesInterval);
  }
  if (modules == null)
    // ["0800", "0830", "0900", ..., "2330"]
    return result;
  if (modules) return modules_result;
}

function getStartEndTimeByWeek(allModules, weekNumber) {
  // default timings
  let startTime = '0800';
  let endTime = '1800';
  const weekModules = allModules.filter(
    module => parseInt(module.week) === parseInt(weekNumber),
  );
  weekModules.forEach(module => {
    if (parseInt(module.startTime) < parseInt(startTime)) {
      startTime = module.startTime;
    }
    if (parseInt(module.endTime) > parseInt(endTime)) {
      endTime = module.endTime;
    }
  });
  return {startTime, endTime};
}

export default function Timetable(props) {
  let {weekNumber = 1} = props;
  weekNumber = parseInt(weekNumber);

  const modules = getModules(mock);
  console.log({modules});
  const weekTime = getStartEndTimeByWeek(modules, weekNumber);
  const times = generateRows(weekTime.startTime, weekTime.endTime, 30, null);

  const mondayModules = getModules(mock)
    .filter(m => m.week === weekNumber)
    .filter(m => m.day === 'Monday');
  const tuesdayModules = getModules(mock)
    .filter(m => m.week === weekNumber)
    .filter(m => m.day === 'Tuesday');
  const wednesdayModules = getModules(mock)
    .filter(m => m.week === weekNumber)
    .filter(m => m.day === 'Wednesday');
  const thursdayModules = getModules(mock)
    .filter(m => m.week === weekNumber)
    .filter(m => m.day === 'Thursday');
  const fridayModules = getModules(mock)
    .filter(m => m.week === weekNumber)
    .filter(m => m.day === 'Friday');

  const mondayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    mondayModules,
  );
  const tuesdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    tuesdayModules,
  );
  const wednesdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    wednesdayModules,
  );
  const thursdayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    thursdayModules,
  );
  const fridayArray = generateRows(
    weekTime.startTime,
    weekTime.endTime,
    30,
    fridayModules,
  );

  const days = [
    createDay('Monday', mondayArray),
    createDay('Tuesday', tuesdayArray),
    createDay('Wednesday', wednesdayArray),
    createDay('Thursday', thursdayArray),
    createDay('Friday', fridayArray),
  ];

  return (
    <div style={{display: 'grid ', overflow: 'auto'}}>
      <table className="nice-table" aria-label="customized table">
        <thead>
          <tr>
            <th>Day/Time</th>
            {times.map(time => (
              <th align="center">{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, i) => (
            <tr key={i}>
              <th className="tdays">{day.name}</th>
              {day.modules.map((cell, j) => (
                <td key={j} align="center">
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
