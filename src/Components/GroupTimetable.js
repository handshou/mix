import { React, Fragment, useState, useEffect } from "react";
import {
  getStudentGroups,
  getStudentEvents,
} from "../Functions/apiFunctions.js";

import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import Tabs from "@material-ui/core/Tabs";
import TabPanel from "@material-ui/lab/TabPanel";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

function GroupTimetable(props) {
  const [value, setValue] = useState(0);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentGroups, setStudentGroups] = useState();
  const [studentEventsPerGroup, setStudentEventsPerGroup] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    if (
      studentGroups !== undefined &&
      studentGroups.length !== undefined &&
      studentGroups.length > 0
    ) {
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
            if (
              studentEvents !== null &&
              studentEvents !== undefined &&
              studentEvents.length
            ) {
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

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          wigth: "100%",
          padding: "2%",
        }}
      >
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            {studentGroups !== undefined &&
            studentGroups.length !== undefined &&
            studentGroups.length > 0 ? (
              studentGroups.map((studentGroup, index) => {
                return (
                  <Tab
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
            {studentGroups !== undefined &&
            studentGroups.length !== undefined &&
            studentGroups.length > 0 &&
            studentEventsPerGroup ? (
              studentGroups.map((studentGroup, index) => {
                return (
                  <TabPanel value={JSON.stringify(index)}>
                    {studentEventsPerGroup[index] !== undefined ? (
                      studentEventsPerGroup[index].map((event, index2) => {
                        return <div>{JSON.stringify(event)} </div>;
                      })
                    ) : (
                      <div>Lmao no events lul</div>
                    )}
                  </TabPanel>
                );
              })
            ) : (
              <div />
            )}
          </TabContext>
        </Paper>
      </div>
    </Fragment>
  );
}

export default GroupTimetable;
