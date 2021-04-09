import { React, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import { Tooltip, IconButton } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";

import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";
import { overrideStudentEventsToDB } from "../../Functions/apiFunctions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

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

export default function CreatePersonalEvent(props) {
  const [refreshKey, setRefreshKey] = useState(0);

  let localTimetableData = [];
  if (props !== undefined && props.timetableData !== undefined) {
    localTimetableData = props.timetableData;
  }

  const [modalStyle] = useState(getModalStyle);
  const initialState = {
    endTime: "",
    eventName: "",
    eventType: "",
    startTime: "",
  };

  const [module, setModule] = useState(initialState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModule({ ...module, [name]: value });
  };

  const saveModule = () => {
    var addEventPrompt = window.confirm(
      `Are you sure you want to add the event?\nYou cannot undo this.`
    );

    if (addEventPrompt) {
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
    }
    else {
      setOpen(false);
      toast.success("Adding of event is cancelled.");
    }
  };

  useEffect(() => {
    setRefreshKey(0);

    if (props.triggerMyTimetableForceRefresh !== undefined) {
      props.triggerMyTimetableForceRefresh();
    }
  }, [refreshKey]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let newDate = new Date();
  let todayDate = moment(newDate).format("DD-MM-YYYY");
  let day = moment().format("dddd");
  const body = (
    <div style={modalStyle}>
      <p style={{ fontSize: "25px", color: "#ff5138" }}>
        Add a 30 Minutes Time Block Interval Event
        <Tooltip
          title={
            <em style={{ fontSize: "12px" }}>
              {
                "Add a event to your personal timetable, you may choose either a 'Private' event status for your personal commitment or 'Others' event status for general event."
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
          style={{
            float: "right",
            borderRadius: "15px",
            boxShadow: "5px 5px 5px 0px grey",
          }}
          color="secondary"
        >
          <ClearIcon fontSize="small" />
        </Button>
      </p>
      <p>
        Today's Date: {todayDate}, {day}
      </p>
      <form onSubmit={saveModule}>
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
          value={module.eventName}
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
          Start Date and Time (Input in 30 Minutes Time Block Interval): *{" "}
        </label>
        <input
          type="datetime-local"
          step="1800"
          className="form-control"
          id="startTime"
          required={true}
          value={module.startTime}
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
          End Date and Time (Input in 30 Minutes Time Block Interval): *{" "}
        </label>
        <input
          type="datetime-local"
          step="1800"
          className="form-control"
          id="endTime"
          required={true}
          value={module.endTime}
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
        <Tooltip
          title={
            <em style={{ fontSize: "12px" }}>
              {"Click here to submit the form"}
            </em>
          }
        >
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
        </Tooltip>
        &nbsp;
        <Button
          onClick={handleClose}
          variant="contained"
          style={{ boxShadow: "5px 5px 5px 0px grey" }}
          color="secondary"
        >
          Cancel
        </Button>
      </form>
    </div>
  );

  return (
    <div className="submit-form">
      <span>
        <Tooltip
          title={
            <em style={{ fontSize: "12px" }}>
              {"Click here to add a new event to your personal timetable"}
            </em>
          }
        >
          <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            style={{ boxShadow: "5px 5px 5px 0px grey" }}
          >
            <AddIcon fontSize="small" style={{ color: "white" }} />
            Add Event
          </Button>
        </Tooltip>
      </span>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}
