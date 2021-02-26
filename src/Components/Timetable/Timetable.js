import {React} from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import './timetable.css';
import {mock} from './mock';

// create time intervals (top row) - ok
// create row representing day - ok
// get mock data from api - ok
// filter mock data by week, and by day - ok

// tasks tonight
// 1 create row representing modules with time intervals separation - ...
// 1.1 create function for finding earliest, latest modules each week
// 2 refactoring components into smaller files - ...
// 3 create a store to remember which week we are on (or check current day) - ..
// 4 create weekly timetables by week number - ...

function getModules(data) {
  const baseDate = new Date('Jan 11 2021 0:00 GMT+8').getTime();
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

const mondayModules = getModules(mock)
  .filter(m => m.week === 1)
  .filter(m => m.day === 'Monday');
const tuesdayModules = getModules(mock)
  .filter(m => m.week === 1)
  .filter(m => m.day === 'Tuesday');
const wednesdayModules = getModules(mock)
  .filter(m => m.week === 1)
  .filter(m => m.day === 'Wednesday');
const thursdayModules = getModules(mock)
  .filter(m => m.week === 1)
  .filter(m => m.day === 'Thursday');
const fridayModules = getModules(mock)
  .filter(m => m.week === 1)
  .filter(m => m.day === 'Friday');

const days = [
  createDay('Monday', mondayModules),
  createDay('Tuesday', tuesdayModules),
  createDay('Wednesday', wednesdayModules),
  createDay('Thursday', thursdayModules),
  createDay('Friday', fridayModules),
];

function createDay(name, modules) {
  return {name, modules};
}

function createModule(data) {
  console.log({data});
  const {title, type} = data;
  return (
    <>
      <div>{title}</div>
      <div>{type}</div>
    </>
  );
}

function generateRows(startTime, endTime, minutesInterval) {
  // startTime = "0800";
  // endTime = "2330";
  let result = [];
  let minutes = '';
  while (parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);
    startTime = parseInt(startTime) + minutesInterval;
    minutes = String(startTime).slice(-2);
    // console.log({startTime, minutes});
    if (parseInt(minutes) >= 60) {
      startTime = parseInt(startTime) - 60 + 100 + (minutes % 60);
    }
    startTime = String(startTime).padStart(4, '0');
  }
  // ["0800", "0830", "0900", ..., "2330"]
  return result;
}

function getStartEndTimeByWeek(allModules, weekNumber) {
  // default timings
  let startTime = '0800';
  let endTime = '1800';
  const weekModules = allModules.filter(
    module => parseInt(module.week) === parseInt(weekNumber),
  );
  console.log(weekModules);
  weekModules.map(module => {
    if (parseInt(module.startTime) < parseInt(startTime)) {
      console.log(module.title + "'s startTime:  " + module.startTime);
      startTime = module.startTime;
    }
    if (parseInt(module.endTime) > parseInt(endTime)) {
      endTime = module.endTime;
    }
  });
  return {startTime, endTime};
}

export default function Timetable() {
  const times = generateRows('0800', '2330', 30);
  // 1.1 use function for finding earliest, latest modules each week
  const modules = getModules(mock);
  const filteredModules = getStartEndTimeByWeek(modules, '1');
  console.log(filteredModules);
  return (
    <div>
      <input accept="image/*" id="contained-button-file" multiple type="file" />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="default"
          component="span"
          startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
      <input accept="image/*" id="icon-button-file" type="file" />
      <div style={{display: 'grid ', overflow: 'auto'}}>
        <table className="nice-table" aria-label="customized table">
          <thead>
            <tr>
              <td>Day/Time</td>
              {times.map(time => (
                <td align="center">{time}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={i}>
                <td>{day.name}</td>
                {day.modules.map((module, j) => (
                  <td key={j} align="center">
                    {createModule(module)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
