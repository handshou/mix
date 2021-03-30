import { React, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";

import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";
import { overrideStudentEventsToDB } from "../../Functions/apiFunctions";

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

const TimetableModules = (props) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, fullData } = props;

  // console.log(data);

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

  const [modalStyle] = useState(getModalStyle);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteEvent(id, title, type, fullData) {
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
  }

  useEffect(() => {
    setRefreshKey(0);

    if (props.triggerMyTimetableForceRefresh !== undefined) {
      props.triggerMyTimetableForceRefresh();
    }
  }, [refreshKey]);

  // create a new component for modules
  const modules = data.map((module, index) => {
    const { studentId = 0, id, title, type, startTime } = module;

    const body = (
      <div style={modalStyle}>
        <p style={{ fontSize: "25px", color: "#ff5138" }}>Event ID: {id}</p>
        <p style={{ fontSize: "25px", color: "#ff5138" }}>
          Event Title: {title}
        </p>
        <p style={{ fontSize: "25px", color: "#ff5138" }}>
          Event Status: {type}
        </p>
        <p style={{ fontSize: "25px", color: "#ff5138" }}>
          Start Time: {startTime}
        </p>
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

    // function handleClick() {
    //   console.log("studentId", studentId);
    //   console.log("title", title);
    // }

    return (
      <div key={`${id}-${index}`} style={{ backgroundColor: pickColour(type) }}>
        <button onClick={handleOpen}>{title}</button>
        <div>{type}</div>

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
