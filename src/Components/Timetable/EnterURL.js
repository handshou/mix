import { React, useState, useEffect } from "react";
import UserLogin from "../UserLogin";

import importURL from "../tutorialGIFs/ImportURL.mp4";

import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";

import VisualTip from "../VisualTip";

import {
  convertURLtoArray,
  findCorrectTimeslot,
  convertWeekDayTimeToTimestamp,
} from "../../Functions/urlFunctions.js";

import {
  getModDetails,
  addStudentEventsToDB,
  overrideStudentEventsToDB,
  loadTimetable,
} from "../../Functions/apiFunctions.js";

import { useDatabase } from "../../Contexts/DatabaseContext";
import { useUpdateMyModules } from "../../Contexts/MyModulesContext";

import { Button, TextField } from "@material-ui/core";
import "./timetable.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const exportLinkMessage = "Export from NUSMods.com Share/Sync";

const EnterURL = (props) => {
  const database = useDatabase();
  const updateMyModules = useUpdateMyModules();

  const studentId = localStorage.getItem("studentId");

  // handle URL
  const [enteredURL, setEnteredURL] = useState("");
  const [helperText, setHelperText] = useState(exportLinkMessage);
  const [error, setError] = useState(false);
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
  const [functionSelector, setFunctionSelector] = useState(1);

  // hard coded  value until we find a way to properly implement semester recording
  const [currentSemester, setCurrentSemester] = useState(2);

  // tooltip mouseover
  const [mouseOver, setMouseOver] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  // checker to see if api is set, can be removed later on
  useEffect(() => {
    // console.log(modAndClassArray);
    // console.log(modAndClassDetails);
    // console.log(userEventArray);
  }, [modAndClassDetails, userEventArray]);
  useEffect(() => {
    console.log(functionSelector);
  }, [functionSelector]);

  useEffect(() => {
    // catches api catastrophic api errors, though it should never be triggered as there promise.allSettled helps handle Errors
    if (modAndClassArray !== undefined && modAndClassArray.length > 0)
      try {
        getModuleDetails();
      } catch (err) {
        setError(true);
        setHelperText(err);
      }
    else {
      setHelperText(exportLinkMessage);
    }
  }, [modAndClassArray]);

  useEffect(() => {
    if (errorMessage !== undefined && errorMessage.length > 1)
      toast.error(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    var studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.once("value").then((snapshot) => {
      setExistingEvents(snapshot.val());
      // reload
      // loadTimetable(updateMyModules, studentId, database);
    });
  }, [, userEventArray]);

  useEffect(() => {
    // catches invalid URLs
    try {
      convertModsIntoEvents();
    } catch (err) {
      setError(true);
      setHelperText(err);
    }
  }, [modAndClassDetails]);

  useEffect(() => {
    if (userEventArray && userEventArray.length > 0) {
      if (functionSelector === 1) {
        addStudentEventsToDB(
          localStorage.getItem("studentId"),
          userEventArray,
          existingEvents,
          database
        );
        toast.success("Your NUSMods timetable has been updated.");
        setFunctionSelector(0);
      } else if (functionSelector === 2) {
        overrideStudentEventsToDB(
          localStorage.getItem("studentId"),
          userEventArray,
          database
        );
        toast.success("Your NUSMods timetable has been replaced.");
        setFunctionSelector(0);
      }
    }
    // usereventarray can be empty
    if (functionSelector === 3) {
      overrideStudentEventsToDB(
        localStorage.getItem("studentId"),
        userEventArray,
        database
      );
      toast.success("Your NUSMods timetable has been cleared.");
      setFunctionSelector(0);
    }
  }, [userEventArray]);

  // waits for response and sets
  const getModuleDetails = async () => {
    let apiPromises = modAndClassArray.map((modAndClasses) => {
      // only need module code for api to ping details
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
    // safeguards for invalid/dirty Mod&class pairs
    // allowed failed requests to go through but prevents immediate failure
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

  const clearNUSModsTimetable = () => {
    let nonNUSModsEventArray = [];
    if (existingEvents && existingEvents.length > 0) {
      existingEvents.map((event) => {
        // retain custom event types only
        if (
          event.eventType == "Personal Events" ||
          event.eventType == "Others" ||
          event.eventType == "Private"
        ) {
          nonNUSModsEventArray.push(event);
        }
      });
    }
    console.log("nonNUSModsEventArray");
    console.log(nonNUSModsEventArray);
    setUserEventArray(nonNUSModsEventArray);
  };

  let triggerNameRefresh = () => {};
  function handleMouseOver(event) {
    setMouseOver(true);
  }

  function handleMouseOut(event) {
    setMouseOver(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        color: "red",
        alignItems: "baseline",
        marginTop: "1em",
        marginBottom: "1em",
        width: "1000px",
      }}
    >
      <UserLogin />
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <Tooltip
          open={error || mouseOver}
          title={
            <div>
              <em style={{ fontSize: "1.5em" }}>
                {"How to get NUSMods Share/Sync?"}
              </em>
            </div>
          }
        >
          <IconButton style={{ color: error ? "red" : "#000" }}>
            <VisualTip error={error} />
            {/* <HelpIcon fontSize="small" /> */}
          </IconButton>
        </Tooltip>
      </div>
      <TextField
        error={error}
        style={{ margin: "1em" }}
        id="outlined-basic"
        label="Share/Sync Timetable Link "
        fullWidth
        margin="dense"
        helperText={helperText}
        variant="outlined"
        defaultValue={"https://nusmods.com/timetable/sem-2/share?GEM1000..."}
        placeholder={"https://nusmods.com/timetable/sem-2/share?GEM1000..."}
        onChange={(e) => {
          setEnteredURL(e.target.value);
          setHelperText(exportLinkMessage);
          setError(false);
        }}
      />
      <Tooltip
        title={
          <em style={{ fontSize: "1.5em" }}>{"Add Modules to Timetable"}</em>
        }
      >
        <Button
          style={{
            boxShadow: "3px 3px 3px 0px #bbb",
            margin: "1em",
            width: "18em",
          }}
          variant="contained"
          color="primary"
          onClick={() => {
            setFunctionSelector(1);
            // catches invalid URLs
            try {
              setModAndClassArray(convertURLtoArray(enteredURL));
            } catch (err) {
              setHelperText(err);
              setError(true);
            }
          }}
        >
          Import NUSMODS Timetable
        </Button>
      </Tooltip>
      {/*
      <Tooltip
        title={<em style={{ fontSize: "1.5em" }}>{"Override Timetable"}</em>}
      >
        <Button
          style={{
            boxShadow: "3px 3px 3px 0px #bbb",
            margin: "1em",
            width: "15em",
          }}
          variant="contained"
          color="secondary"
          onClick={() => {
            setFunctionSelector(2);
            // catches invalid URLs
            try {
              setModAndClassArray(convertURLtoArray(enteredURL));
            } catch (err) {
              setHelperText(err);
              setError(true);
            }
          }}
        >
          Replace All
        </Button>
      </Tooltip>
      */}
      <Tooltip
        title={<em>{"Click here to clear your imported NUSMods timetable"}</em>}
      >
        <Button
          style={{
            boxShadow: "3px 3px 3px 0px #bbb",
            margin: "1em",
            width: "15em",
          }}
          variant="contained"
          color="secondary"
          onClick={() => {
            setFunctionSelector(3);
            // catches invalid URLs
            try {
              clearNUSModsTimetable();
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          Clear Imported Timetable
        </Button>
      </Tooltip>
      <VisualTip></VisualTip>
    </div>
  );
};

export default EnterURL;
