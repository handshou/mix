import { React, Fragment, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

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

    setRefreshKey(refreshKey + 1);
    setOpen(false);

    toast.success("A new event has been sucessfully added.");
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

  const body = (
    <div style={modalStyle}>
      <p style={{ fontSize: "25px", color: "#ff5138" }}>Add A New Event</p>
      <form onSubmit={saveModule}>
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
          required="required"
          value={module.eventName}
          onChange={handleInputChange}
          name="eventName"
          placeholder="IS4261 6UGs Submission"
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid #ff5138",
            boxShadow: "5px 5px #ff5138",
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
          required="required"
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid #ff5138",
            boxShadow: "5px 5px #ff5138",
          }}
        >
          <option selected hidden>
            Choose Here!
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
            outline: "3px solid #ff5138",
            boxShadow: "5px 5px #ff5138",
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
          required={true}
          value={module.endTime}
          onChange={handleInputChange}
          name="endTime"
          min="2021-01-10T00:00"
          max="2021-12-31T00:00"
          style={{
            width: "100%",
            padding: "0.7em",
            marginBottom: "0.5rem",
            outline: "3px solid #ff5138",
            boxShadow: "5px 5px #ff5138",
          }}
        />
        <br></br>
        <br></br>
        {/* <Button onClick={saveModule} setOpen="false" variant="contained">
          Submit
        </Button> */}
        <Button variant="contained">
        {/* <input type="submit" value="SUBMIT" style={{background: "#e7e7e7", padding: "8px", borderRadius: "5px"}}> */}
        <input type="submit" value="SUBMIT" style={{background: "none"}}>
        </input>
        </Button>

        &nbsp;
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </form>
    </div>
  );

  return (
    <div className="submit-form">
      <span style={{ left: "1350px", bottom: "500px" }}>
        <Tooltip
          title={
            <em>
              {"Click here to add a new event to your personal timetable"}
            </em>
          }
        >
          <Button
            onClick={handleOpen}
            variant="contained"
            style={{ boxShadow: "5px 5px 5px 0px grey" }}
          >
            Add New Event
          </Button>
        </Tooltip>
      </span>
      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  );
}
