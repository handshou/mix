import { React, useState, useEffect } from "react";
import firebase from "firebase";

import {
  Legend,
  EnterURL,
  Timetable,
  WeekSwitcher,
  CreatePersonalEvent,
} from "../../Components/Timetable";

import "../../Components/Timetable/timetable.css";

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

  return (
    <>
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

      <Timetable weekNumber={week} timetableData={timetableData} />

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
    </>
  );
}
