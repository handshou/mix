import {React} from "react";
import {  makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import './timetable.css';

import rawData from "./rawData.json";

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

  while(parseInt(startTime) < parseInt(endTime)) {
    result.push(startTime);

    startTime = parseInt(startTime) + minutesInterval;
    
    const minutes = String(startTime).slice(-2);
    // console.log({startTime, minutes});
    if(parseInt(minutes) >= 60) {
      startTime = parseInt(startTime) - 60 + 100 + (minutes % 60)
    }

    startTime = String(startTime).padStart(4, '0');
  }

  // ["0800", "0830", "0900", ..., "2330"]
  return result;
}

function convertTimeToWeeks(){
  // const tryDate = rawData.rawData[1].startTime;
  // console.log(tryDate);
  const baseDate = new Date("Jan 11 2021 0:00 GMT+8").getTime();
  // console.log(basedate);
  // const difference = tryDate - basedate;
  // console.log(difference);
  // console.log(Math.floor(difference/604800000));
  
  const getRawData = [...rawData.rawData];
  // console.log(getRawData);
  getRawData.map((d) => Math.floor((d.startTime - baseDate)/604800000));
  console.log(getRawData.map((a) => (new Date(a.startTime))));
  // console.log(getRawData.map((b) => (b.startTime.getTime())));
  
}

const days = [
  createDays("Monday", [{title: "CS2105", date: "1st Feb"}, {title: "IS4261", date: "1st Feb"}, {}, {}, {}, {title: "Appt", date: "1st Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},{}]),
  createDays("Tuesday", [{title: "IS4261", date: "2nd Feb"}, {title: "IS4243", date: "2nd Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},{}]),
  createDays("Wednesday", [{title: "IS4243", date: "3rd Feb"}, {title: "IS4261", date: "3rd Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {title: "Appt", date: "3rd Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},{}]),
  createDays("Thursday", [{title: "IS4261", date: "4th Feb"}, {title: "IS4243", date: "4th Feb"}, {}, {title: "Appt", date: "4th Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},{}]),
  createDays("Friday", [{title: "IS4243", date: "5th Feb"}, {title: "IS4261", date: "5th Feb"}, {}, {}, {}, {}, {title: "Appt", date: "5th Feb"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},{}]),
];

export default function Timetable() {
  const classes = useStyles();
  const times = generateIntervals("0800", "2330", 30);
  convertTimeToWeeks();

  return (
    <div>
      <div className={classes.root2}>
        <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
        />
        <label htmlFor="contained-button-file">
            <Button variant="contained" color="default" component="span" startIcon={<CloudUploadIcon />}>
              Upload
            </Button>
        </label>
        <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
      </div>
      <div style={{"display": "grid ", "overflow":"auto"}}>
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
                  {day.modules.map((module) => <td key={day.title} align="center">{createModule(module)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
