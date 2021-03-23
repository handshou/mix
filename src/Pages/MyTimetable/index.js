import { React, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase";

import {
  Legend,
  EnterURL,
  Timetable,
  WeekSwitcher,
  CreatePersonalEvent,
} from "../../Components/Timetable";

import "../../Components/Timetable/timetable.css";

const useStyles = makeStyles({
  paper: {
    marginTop: "-0.5em",
    backgroundColor: "#FFF",
    height: "100%",
  },
});

export default function MyTimetable(props) {
  const [week, setWeek] = useState(1);
  const [timetableData, setTimetableData] = useState([]);

  let triggerLayoutForceRefresh = () => {};
  if (props.triggerLayoutForceRefresh !== undefined) {
    triggerLayoutForceRefresh = () => {
      props.triggerLayoutForceRefresh();
    };
  }

  let loadTimetable = () => {
    // ensure database is initialised first
    if (!firebase.apps.length) {
      let studentId = localStorage.getItem("studentId");
      if (studentId !== null) {
        var studentsRef = database.ref(`Students/${studentId}/events`);
        studentsRef.once("value").then((snapshot) => {
          setTimetableData(snapshot.val());
        });
      }
    } else {
      firebase.app();
      var database = firebase.app().database();
      let studentId = localStorage.getItem("studentId");
      if (studentId !== null) {
        var studentsRef = database.ref(`Students/${studentId}/events`);
        studentsRef.once("value").then((snapshot) => {
          setTimetableData(snapshot.val());
        });
      }
    }
  };

  let triggerMyTimetableForceRefresh = () => {
    loadTimetable();
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  // lift week in WeekSwitcher
  const handleWeekChange = (event, value) => {
    // use event as first element, ordering requirement to extract value
    setWeek(value);
  };

  const classes = useStyles();

  return (
    <Paper className={classes.paper} square>
        {" "}
        <Timetable weekNumber={week} timetableData={timetableData}>
          <div className="header">
            <div id="legend">
              <Legend />
            </div>
            <div id="week-switcher">
              <WeekSwitcher handleChange={handleWeekChange} week={week} />
            </div>
            <div id="action-button">
              <CreatePersonalEvent
                timetableData={timetableData}
                triggerMyTimetableForceRefresh={() => {
                  triggerMyTimetableForceRefresh();
                }}
              />
            </div>
          </div>
        </Timetable>
        <div id="url-input">
          <EnterURL
            triggerLayoutForceRefresh={() => {
              triggerLayoutForceRefresh();
            }}
            triggerMyTimetableForceRefresh={() => {
              triggerMyTimetableForceRefresh();
            }}
          />
        </div>
    </Paper>
  );
}
