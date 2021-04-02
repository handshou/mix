import { React, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/Help";
import ClearIcon from "@material-ui/icons/Clear";

import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";
import { overrideStudentEventsToDB } from "../../Functions/apiFunctions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function pickColour(type) {
  let colors = ["#FDDFDF", "#F0DEFD", "#DEFDE0", "#DEF3FD", "#FCF7DE"];
  let setColor = "#FFFFFF";

  if (type.includes("Lecture")) {
    setColor = colors[0];
  } else if (type.includes("Tutorial")) {
    setColor = colors[1];
  } else if (type == "Private") {
    setColor = colors[2];
  } else {
    setColor = colors[3];
  }
  return setColor;
}

function getModalStyle() {
  return {
    padding: "50px",
    background: "#f9f9f9",
    marginTop: "3rem",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  };
}

const TimetableModules = (props) => {
  let localTimetableData = [];
  if (props !== undefined && props.fullData !== undefined) {
    localTimetableData = props.fullData;
  }

  const { data, fullData } = props;
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const initialState = {
    endTime: "",
    eventName: "",
    eventType: "",
    startTime: "",
  };

  const [module, setModule] = useState(initialState);

  if (module.id !== data.key) {
    setModule(data.endTime, data.title);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModule({ ...module, [name]: value });
  };

  const updateModule = () => {
    var data = {
      endTime: new Date(module.endTime).getTime(),
      eventName: module.eventName,
      eventType: module.eventType,
      startTime: new Date(module.startTime).getTime(),
    };

    let newTimetableData = [...localTimetableData];
    newTimetableData.push(data);

    var database;
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      database = firebaseApp.database();
    } else {
      firebase.app();
      database = firebase.app().database();
    }
    overrideStudentEventsToDB(
      localStorage.getItem("studentId"),
      newTimetableData,
      database
    );

    setRefreshKey(refreshKey + 1);
    setOpen(false);

    toast.success("A new event has been sucessfully added.");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteEvent(id, title, type, fullData) {
    var deleteEventPrompt = window.confirm(
      `Are you sure you want to delete the event?\nYou cannot undo this.`
    );

    if (deleteEventPrompt) {
      const startTimeSplit = id.split("-")[0];

      const newData = fullData.filter(
        (event) =>
          event.startTime != startTimeSplit ||
          event.eventName != title ||
          event.eventType != type
      );

      var database;
      if (!firebase.apps.length) {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        database = firebaseApp.database();
      } else {
        firebase.app();
        database = firebase.app().database();
      }
      overrideStudentEventsToDB(
        localStorage.getItem("studentId"),
        newData,
        database
      );

      setRefreshKey(refreshKey + 1);
      setOpen(false);

      toast.success("The event has been deleted successfully.");
    } else {
      setOpen(false);
      toast.success("Deletion of event is cancelled.");
    }
  }

  useEffect(() => {
    setRefreshKey(0);

    if (props.triggerMyTimetableForceRefresh !== undefined) {
      props.triggerMyTimetableForceRefresh();
    }
  }, [refreshKey]);

  // create a new component for modules
  const modules = data.map((module, index) => {
    const { studentId = 0, id, title, type, startTime, endTime } = module;

    const body = (
      <div style={modalStyle}>
        <p style={{ fontSize: "25px", color: "#ff5138" }}>
          View Event Details
          <Tooltip
            title={
              <em style={{ fontSize: "12px" }}>
                {
                  "Through this page, you are able to view the details of your event."
                }
              </em>
            }
          >
            <IconButton aria-label="delete">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            onClick={handleClose}
            variant="contained"
            style={{ float: "right", borderRadius: "15px" }}
            color="secondary"
          >
            <ClearIcon fontSize="small" />
          </Button>
        </p>{" "}
        <p>
          {/* <form onSubmit={updateModule}>
            <label
              for="eventName"
              style={{
                textAlign: "left",
                display: "block",
                padding: "0.5em 1.5em 0.5em 0",
              }}
            >
              Title: *{" "}
            </label>
            <input
              type="text"
              className="form-control"
              id="eventName"
              required="required"
              value={title}
              onChange={handleInputChange}
              name="eventName"
              placeholder="Example: IS4261 6UGs Submission..."
              style={{
                width: "100%",
                padding: "0.7em",
                marginBottom: "0.5rem",
                outline: "1px solid #ff5138",
                boxShadow: "3px 3px 3px 0px #ff5138",
              }}
            />
            <label
              for="eventType"
              style={{
                textAlign: "left",
                display: "block",
                padding: "0.5em 1.5em 0.5em 0",
              }}
            >
              Event Status: *{" "}
            </label>
            <select
              name="eventType"
              id="eventType"
              required="required"
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "0.7em",
                marginBottom: "0.5rem",
                outline: "1px solid #ff5138",
                boxShadow: "3px 3px 3px 0px #ff5138",
              }}
            >
              <option selected hidden>
                Select your event status
              </option>
              <option value="Private">Private</option>
              <option value="Others">Others</option>
            </select>
            <label
              for="startTime"
              style={{
                textAlign: "left",
                display: "block",
                padding: "0.5em 1.5em 0.5em 0",
              }}
            >
              Start Date and Time (30 Minutes Time Block): *{" "}
            </label>
            <input
              type="datetime-local"
              step="1800"
              className="form-control"
              id="startTime"
              required={true}
              value={startTime}
              onChange={handleInputChange}
              name="startTime"
              min="2021-01-10T00:00"
              max="2021-12-31T00:00"
              style={{
                width: "100%",
                padding: "0.7em",
                marginBottom: "0.5rem",
                outline: "1px solid #ff5138",
                boxShadow: "3px 3px 3px 0px #ff5138",
              }}
            />
            <label
              for="endTime"
              style={{
                textAlign: "left",
                display: "block",
                padding: "0.5em 1.5em 0.5em 0",
              }}
            >
              End Date and Time (30 Minutes Time Block): *{" "}
            </label>
            <input
              type="datetime-local"
              step="1800"
              className="form-control"
              id="endTime"
              required={true}
              value={endTime}
              onChange={handleInputChange}
              name="endTime"
              min={module.startTime}
              max="2021-12-31T00:00"
              style={{
                width: "100%",
                padding: "0.7em",
                marginBottom: "0.5rem",
                outline: "1px solid #ff5138",
                boxShadow: "3px 3px 3px 0px #ff5138",
              }}
            />
            <br></br>
            <Button
              variant="contained"
              style={{ boxShadow: "5px 5px 5px 0px grey" }}
              color="primary"
            >
              <input
                type="submit"
                value="SUBMIT"
                style={{ background: "none" }}
              ></input>
            </Button>
          </form> */}
        </p>
        <p>Event Title: {title}</p>
        <p>Event Status: {type}</p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        <br></br>
        <Button
          onClick={() => deleteEvent(id, title, type, fullData)}
          variant="contained"
          style={{ boxShadow: "5px 5px 5px 0px grey" }}
          color="primary"
        >
          Delete
        </Button>
        &nbsp;
        <Button
          onClick={handleClose}
          variant="contained"
          style={{ boxShadow: "5px 5px 5px 0px grey" }}
          color="secondary"
        >
          Cancel
        </Button>
      </div>
    );

    return (
      <div key={`${id}-${index}`} style={{ backgroundColor: pickColour(type) }}>
        <button onClick={handleOpen}>
          <div>{title}</div>
          <div>{type}</div>
        </button>
        <div>
          <Modal open={open} onClose={handleClose}>
            {body}
          </Modal>
        </div>
      </div>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {modules}
    </div>
  );
};

export { TimetableModules };
