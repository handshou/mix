import { React, Fragment, useState, useEffect } from "react";
import Body from "./Body";
import {
  convertURLtoArray,
  findCorrectTimeslot,
  convertWeekDayTimeToTimestamp,
} from "../Functions/urlFunctions.js";
import { getModDetails } from "../Functions/apiFunctions.js";
import { Button, Input } from "@material-ui/core";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

function UserProfile(props) {
  const [userList, setUserList] = useState({});
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

  // Contains user event array
  const [userEventArray, setUserEventArray] = useState([]);

  // hard coded  value until we find a way to properly implement semester recording
  const [currentSemester, setCurrentSemester] = useState(2);

  // checker to see if api is set, can be removed later on
  useEffect(() => {
    // console.log(modAndClassArray);
    // console.log(modAndClassDetails);
    // console.log(userEventArray);
  }, [modAndClassDetails, userEventArray]);

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
          JSON.stringify(modAndClassDetail.status) === "\"fulfilled\"" &&
          JSON.stringify(modAndClassDetail.value.moduleCode) ==
          JSON.stringify(modAndClass[0])
        ) {
          specificClassDetails = modAndClassDetail.value;
        }
      });
      // converts the unparsed data into timeslots
      let correctTimeSlots = undefined
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
            name: timeslot.moduleCode,
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

  let getUsers = () => {
    var usersRef = database.ref("users/");
    usersRef.once("value").then((snapshot) => {
      snapshot.val() ? setUserList(snapshot.val()) : console.log("missing");
    });
  };

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
        User Profile
      </div>

      <Body getUsers={getUsers} userList={userList} />

      <div>entered URL : {enteredURL}</div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          marginTop: 50,
        }}
      >
        Enter URL:
        <div style={{ color: "red" }}>{errorMessage}</div>
        <Input
          style={{ width: 300 }}
          value={enteredURL}
          onChange={(e) => {
            setEnteredURL(e.target.value);
            setErrorMessage("");
          }}
        ></Input>
        <Button
          variant="contained"
          onClick={() => {
            // catches invalid URLs
            try {
              setModAndClassArray(convertURLtoArray(enteredURL));
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          parse timetable
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // catches api catastrophic api errors, though it should never be triggered as there promise.allSettled helps handle Errors
            try {
              getModuleDetails();
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          Ping timetable
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // catches invalid URLs
            try {
              convertModsIntoEvents();
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          Find occupied time
        </Button>
      </div>

      {/* Currently displays the pulled data of all time slots, can cleanup for less mess */}
      <div style={{ marginTop: 100 }}>
        {userEventArray && userEventArray.length > 1
          ? userEventArray.map((events) => {
            return (
              <div>
                <div>{JSON.stringify(events)}</div>
              </div>
            );
          })
          : ""}
      </div>
    </Fragment>
  );
}

export default UserProfile;
