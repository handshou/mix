import { React, Fragment, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";

import { overrideStudentEventsToDB } from "../../Functions/apiFunctions";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  return {
    // position: "Absolute",
    // left: "500px",
    // top: "300px",
    // backgroundColor: "#F5F5DC",
    // width: "500px",
    // padding: "20px",

    padding: "50px",
    background: "#f9f9f9",
    border: "5px solid #c1c1c1",
    marginTop: "2rem",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  };
}

export default function CreatePersonalEvent(props) {
  let localTimetableData = [];
  if (props !== undefined && props.timetableData !== undefined) {
    localTimetableData = props.timetableData;
  }

  const [modalStyle] = useState(getModalStyle);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
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
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle}>
      <b>Add A New Event</b>
      {/* <div className="form-group"> */}
      <form>
        <label
          for="eventName"
          style={{
            textAlign: "left",
            display: "block",
            padding: "0.5em 1.5em 0.5em 0",
          }}
        >
          Title:{" "}
        </label>
        <input
          type="text"
          className="form-control"
          id="eventName"
          required
          value={module.eventName}
          onChange={handleInputChange}
          name="eventName"
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid gold",
          }}
        />

        <br></br>
        <label
          for="eventType"
          style={{
            textAlign: "left",
            display: "block",
            padding: "0.5em 1.5em 0.5em 0",
          }}
        >
          Event Type:{" "}
        </label>
        <select
          name="eventType"
          id="eventType"
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid gold",
          }}
        >
          <option selected hidden>
            Choose here
          </option>
          <option value="Private">Personal Event</option>
          <option value="Others">Others</option>
        </select>
        <br></br>

        <label
          for="startTime"
          style={{
            textAlign: "left",
            display: "block",
            padding: "0.5em 1.5em 0.5em 0",
          }}
        >
          Start Date and Time:{" "}
        </label>
        <input
          type="datetime-local"
          step="1800"
          className="form-control"
          id="startTime"
          required
          value={module.startTime}
          onChange={handleInputChange}
          name="startTime"
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid gold",
          }}
        />
        <br></br>
        <label
          for="endTime"
          style={{
            textAlign: "left",
            display: "block",
            padding: "0.5em 1.5em 0.5em 0",
          }}
        >
          End Date and Time:{" "}
        </label>
        <input
          type="datetime-local"
          step="1800"
          className="form-control"
          id="endTime"
          required
          value={module.endTime}
          onChange={handleInputChange}
          name="endTime"
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid gold",
          }}
        />
        {/* </div> */}
        <br></br>
        <br></br>
        <Button onClick={saveModule} setOpen = "false" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );

  return (
    <div className="submit-form">
      <span style={{ position: "absolute", left: "1350px", bottom: "500px" }}>
        <Tooltip
          title={
            <em>
              {"Click here to add a new event to your personal timetable"}
            </em>
          }
        >
          <Button onClick={handleOpen} variant="contained">
            Add New Event
          </Button>
        </Tooltip>
      </span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
