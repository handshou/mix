import { React } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EnterURL from "./EnterURL";
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import './timetable.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  table: {
    minWidth: 2500,
  },
  root2: {
    textAlign: 'right',
    padding: '10px',
  },
}));

function createDays(name, modules) {
  return { name, modules };
}

function createModule({ title, date }) {
  return <>
    <div>{title}</div>
    <div>{date}</div>
  </>
}

function generateIntervals(startTime, endTime, minutesInterval) {
  // startTime = "0800";
  // endTime = "2330";
  const result = [];

  while (parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);

    startTime = parseInt(startTime) + minutesInterval;

    const minutes = String(startTime).slice(-2);
    console.log({ startTime, minutes });
    if (parseInt(minutes) >= 60) {
      startTime = parseInt(startTime) - 60 + 100 + (minutes % 60)
    }

    startTime = String(startTime).padStart(4, '0');
  }

  // ["0800", "0830", "0900", ..., "2330"]
  return result;
}

const days = [
  createDays("Monday", [{ title: "CS2105", date: "1st Feb" }, { title: "IS4261", date: "1st Feb" }, {}, {}, {}, { title: "Appt", date: "1st Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
  createDays("Tuesday", [{ title: "IS4261", date: "2nd Feb" }, { title: "IS4243", date: "2nd Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
  createDays("Wednesday", [{ title: "IS4243", date: "3rd Feb" }, { title: "IS4261", date: "3rd Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, { title: "Appt", date: "3rd Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
  createDays("Thursday", [{ title: "IS4261", date: "4th Feb" }, { title: "IS4243", date: "4th Feb" }, {}, { title: "Appt", date: "4th Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
  createDays("Friday", [{ title: "IS4243", date: "5th Feb" }, { title: "IS4261", date: "5th Feb" }, {}, {}, {}, {}, { title: "Appt", date: "5th Feb" }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]),
];

export default function Timetable() {
  const classes = useStyles();
  const times = generateIntervals("0800", "2330", 30);

  return (
    <div>
      <div style={{ minHeight: 50}}>
        <EnterURL />
      </div>
      <div style={{ "display": "grid ", "overflow": "auto" }}>
        <table className="nice-table" aria-label="customized table">
          <thead>
            <tr>
              <td>Day/Time</td>
              {times.map(time => <td align="center">{time}</td>)}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.name}>
                <td component="th" scope="row">
                  {day.name}
                </td>
                {day.modules.map((module) => <td align="center">{createModule(module)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
