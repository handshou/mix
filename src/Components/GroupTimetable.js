import { React, Fragment, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import Tabs from "@material-ui/core/Tabs";
import TabPanel from "@material-ui/lab/TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import {
  getStudentGroups,
  getStudentEvents,
} from "../Functions/apiFunctions.js";
import { Timetable, WeekSwitcher } from "../Components/Timetable";

import { getCurrentWeek } from "../Components/Timetable/utils";

const useStyles = makeStyles({
  paper: {
    backgroundColor: "#FFF",
  },
});

function GroupTimetable(props) {
  const [week, setWeek] = useState(getCurrentWeek());
  const [value, setValue] = useState(0);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentGroups, setStudentGroups] = useState();
  const [studentEventsPerGroup, setStudentEventsPerGroup] = useState();

  const handleWeekChange = (event, value) => {
    // use event as first element, ordering requirement to extract value
    setWeek(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const anyStudentGroups =
    studentGroups !== null &&
    studentGroups !== undefined &&
    studentGroups.length > 0;

  const exists = (arrayElement) =>
    arrayElement !== null &&
    arrayElement !== undefined &&
    arrayElement.length > 0;

  useEffect(async () => {
    var database;
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      database = firebaseApp.database();
    } else {
      // If firebase is already initialized
      firebase.app();
      database = firebase.app().database();
    }
    if (studentId !== null && studentId !== undefined) {
      setStudentGroups(await getStudentGroups(studentId, database));
    }
  }, [studentId]);

  useEffect(async () => {
    if (anyStudentGroups) {
      var database;
      if (!firebase.apps.length) {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        database = firebaseApp.database();
      } else {
        // If firebase is already initialized
        firebase.app();
        database = firebase.app().database();
      }

      // array of student events per member per group
      let studentEventsPerGroupPerStudent = await Promise.all(
        studentGroups.map(async (studentGroup) => {
          return await Promise.all(
            studentGroup.members.map(async (memberId) => {
              return await getStudentEvents(memberId, database);
            })
          );
        })
      );

      setStudentEventsPerGroup(
        studentEventsPerGroupPerStudent.map((studentEventsArrayPerGroup) => {
          let flattenedEventsArray = [];
          studentEventsArrayPerGroup.forEach((studentEvents) => {
            if (exists(studentEvents)) {
              flattenedEventsArray = [
                ...flattenedEventsArray,
                ...studentEvents,
              ];
            }
          });
          return flattenedEventsArray;
        })
      );
    }
  }, [studentGroups]);

  const classes = useStyles();

  return (
    <Fragment>
      <Paper className={classes.paper} square>
        {anyStudentGroups && (
          <WeekSwitcher handleChange={handleWeekChange} week={week} />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            wigth: "100%",
            // padding: "2%",
          }}
        >
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="Project Group Tabs"
            centered
          >
            {anyStudentGroups ? (
              studentGroups.map((studentGroup, index) => {
                return (
                  <Tab
                    key={studentGroup.groupId}
                    label={studentGroup.groupName}
                    id={studentGroup.groupId}
                  />
                );
              })
            ) : (
              <Tab label="No Groups" />
            )}
          </Tabs>
          <TabContext value={JSON.stringify(value)}>
            {anyStudentGroups && studentEventsPerGroup ? (
              studentGroups.map((studentGroup, index) => {
                return (
                  <TabPanel
                    key={studentGroup.groupId}
                    value={JSON.stringify(index)}
                  >
                    {studentEventsPerGroup[index] !== undefined ? (
                      <Timetable
                        key={studentGroup.groupId}
                        weekNumber={week}
                        timetableData={studentEventsPerGroup[index]}
                      />
                    ) : (
                      <div>No events found</div>
                    )}
                  </TabPanel>
                );
              })
            ) : (
              <div />
            )}
          </TabContext>
        </div>
      </Paper>
    </Fragment>
  );
}

export default GroupTimetable;
