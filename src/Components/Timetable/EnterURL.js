import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";

import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";

import {
  convertURLtoArray,
  findCorrectTimeslot,
  convertWeekDayTimeToTimestamp,
} from "../../Functions/urlFunctions.js";
import {
  getModDetails,
  addStudentEventsToDB,
} from "../../Functions/apiFunctions.js";
import { Button, OutlinedInput } from "@material-ui/core";
import "./timetable.css";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

export function EnterURL(props) {
  // handle new user
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));

  let getStudentName = (studentId) => {
    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/name`
    );
    studentsRef.once("value").then((snapshot) => {
      setStudentName(snapshot.val());
    });
  };

  let createStudentId = (studentName) => {
    console.log("studentName: " + studentName);
    var query = database.ref("Students/").orderByKey();

    console.log("1: " + query);
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        setStudentId(parseInt(key) + 1);
        localStorage.setItem("studentId", parseInt(key) + 1);
      });
      createStudentRecord(studentName);
    });
  };

  let createStudentRecord = (studentName) => {
    var studentsRef = database.ref(`Students/`);
    studentsRef
      .child(localStorage.getItem("studentId"))
      .child("name")
      .set(studentName);
    setRefreshKey(refreshKey + 1);
    localStorage.setItem("studentName", studentName);
    if (props.triggerLayoutForceRefresh !== undefined) {
      props.triggerLayoutForceRefresh();
    }
  };

  useEffect(() => {
    setRefreshKey(0);
    if (localStorage.getItem("studentId") == null) {
      var studentName = prompt(
        "Hi! Seems like this is the first time you visited MixTime. \nPlease enter your name and we'll tag it into your timetable."
      );
      createStudentId(studentName);
    } else {
      getStudentName(localStorage.getItem("studentId"));
    }
  }, [refreshKey]);

  // handle URL
  const [enteredURL, setEnteredURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Array which contains array of classes and slots occupied for the module
  // 00: (2) ["ACC3619", "SEC:A3"]
  // 01: (3) ["GES1041", "TUT:D6", "LEC:1"]
  // 02: (3) ["IS4100", "TUT:2", "LEC:1"]
  // 03: (3) ["IS4234", "TUT:2", "LEC:1"]
  // 04: (2) ["IS4261", "LEC:1"]
  const [modAndClassArray, setModAndClassArray] = useState([]);
  // Array which contains resolved promises with either details of the module in .value or error message in .reason
  const [modAndClassDetails, setModAndClassDetails] = useState([]);

  // Contains user's existing event array
  const [existingEvents, setExistingEvents] = useState([]);
  // Contains new user event array
  const [userEventArray, setUserEventArray] = useState([]);

  // hard coded  value until we find a way to properly implement semester recording
  const [currentSemester, setCurrentSemester] = useState(2);

  // checker to see if api is set, can be removed later on
  useEffect(() => {
    // console.log(modAndClassArray);
    // console.log(modAndClassDetails);
    // console.log(userEventArray);
  }, [modAndClassDetails, userEventArray]);

  useEffect(() => {
    // catches api catastrophic api errors, though it should never be triggered as there promise.allSettled helps handle Errors
    try {
      getModuleDetails();
    } catch (error) {
      setErrorMessage(error);
    }
  }, [modAndClassArray]);

  useEffect(() => {
    var studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.once("value").then((snapshot) => {
      setExistingEvents(snapshot.val());
      if (props.triggerMyTimetableForceRefresh !== undefined) {
        props.triggerMyTimetableForceRefresh();
      }
    });
  }, [userEventArray]);

  useEffect(() => {
    // catches invalid URLs
    try {
      convertModsIntoEvents();
    } catch (error) {
      setErrorMessage(error);
    }
  }, [modAndClassDetails]);

  useEffect(() => {
    if (userEventArray && userEventArray.length > 0)
      addStudentEventsToDB(studentId, userEventArray, existingEvents, database);
  }, [userEventArray]);

  // waits for response and sets
  const getModuleDetails = async () => {
    let apiPromises = modAndClassArray.map((modAndClasses) => {
      // only need module code for api to ping details
      // safeguard for button
      if (
        modAndClasses &&
        modAndClasses.length > 0 &&
        modAndClasses[0].length > 0
      ) {
        return getModDetails(modAndClasses[0]);
      } else {
        console.log("no timetable loaded");
      }
    });
    // .allSettled() used instead of .all()
    // allowed failed requests to go through but prevents immediate failure
    // additional implmentation to catch errors is required
    Promise.allSettled(apiPromises).then((details) => {
      setModAndClassDetails(details);
    });
  };

  // user modAndClassArray and modAndClassDetails to parse the timetable into an array of events
  const convertModsIntoEvents = () => {
    // parses for each mod
    let timeslotArray = modAndClassArray.map((modAndClass) => {
      let specificClassDetails;
      modAndClassDetails.forEach((modAndClassDetail) => {
        if (
          JSON.stringify(modAndClassDetail.status) === '"fulfilled"' &&
          JSON.stringify(modAndClassDetail.value.moduleCode) ==
            JSON.stringify(modAndClass[0])
        ) {
          specificClassDetails = modAndClassDetail.value;
        }
      });
      // converts the unparsed data into timeslots
      let correctTimeSlots = undefined;
      if (specificClassDetails !== undefined) {
        correctTimeSlots = findCorrectTimeslot(
          modAndClass,
          specificClassDetails,
          currentSemester
        );
      }
      return correctTimeSlots;
    });

    let newtimeslotArray = [];
    timeslotArray.forEach((events) => {
      if (events !== undefined) {
        newtimeslotArray.push(...events);
      }
    });
    let newEventArray = [];
    newtimeslotArray.forEach((timeslot) => {
      if (
        timeslot !== undefined &&
        timeslot.weeks !== undefined &&
        timeslot.day !== undefined &&
        timeslot.endTime !== undefined
      ) {
        timeslot.weeks.forEach((week) => {
          let startTimestamp = convertWeekDayTimeToTimestamp(
            week,
            timeslot.day,
            timeslot.startTime
          );
          let endTimestamp = convertWeekDayTimeToTimestamp(
            week,
            timeslot.day,
            timeslot.endTime
          );
          newEventArray.push({
            eventName: timeslot.moduleCode,
            eventType: timeslot.lessonType,
            startTime: startTimestamp,
            endTime: endTimestamp,
          });
        });
      }
    });

    // console.log(newEventArray);
    // console.log(newtimeslotArray);

    setUserEventArray(newEventArray);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        color: "red",
        alignItems: "center",
      }}
    >
      <div>
        Enter NUSMODs Sharing URL:
        <Tooltip
          title={
            <em>
              {
                "What is this? Using the shared link on NUSMods, you can import in your modules into MixTime"
              }
            </em>
          }
        >
          <IconButton aria-label="delete">
            <HelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ color: "red" }}>{errorMessage}</div>
      <OutlinedInput
        placeholder={"https://nusmods.com/timetable/sem-2/share?....."}
        style={{ width: 500, marginLeft: 30, marginRight: 30 }}
        onChange={(e) => {
          setEnteredURL(e.target.value);
          setErrorMessage("");
        }}
      ></OutlinedInput>
      <Tooltip
        title={<em>{"Click here to update your personal timetable"}</em>}
      >
        <Button
          style={{ boxShadow: "5px 5px 5px 0px grey" }}
          variant="contained"
          onClick={() => {
            console.log("hih");
            // catches invalid URLs
            try {
              setModAndClassArray(convertURLtoArray(enteredURL));
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          Update Timetable
        </Button>
      </Tooltip>
    </div>
  );
}

export default EnterURL;
