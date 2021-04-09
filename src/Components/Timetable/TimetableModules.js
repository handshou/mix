import { React, useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/Help";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { useDatabase } from "../../Contexts/DatabaseContext";
import {
  loadTimetable,
  getStudentGroupEvents,
  overrideStudentEventsToDB,
} from "../../Functions/apiFunctions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useUpdateMyModules,
  useMyModules,
} from "../../Contexts/MyModulesContext";
import { useUpdateGroupModules } from "../../Contexts/GroupModulesContext";
import { useMyGroups } from "../../Contexts/MyGroupsContext";

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
  const studentId = localStorage.getItem("studentId");
  const updateGroupModules = useUpdateGroupModules();
  const myGroups = useMyGroups();
  const fullData = useMyModules();
  if (props !== undefined && props.fullData !== undefined) {
    localTimetableData = props.fullData;
  }

  const { data } = props;
  // const [refreshKey, setRefreshKey] = useState(0);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const initialState = {
    endTime: "",
    eventName: "",
    eventType: "",
    startTime: "",
  };

  const [module, setModule] = useState(initialState);

  const database = useDatabase();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModule({ ...module, [name]: value });
  };

  function updateEvent(id, title, type, fullData) {
    var updateEventPrompt = window.confirm(
      `Are you sure you want to update the event?\nYou cannot undo this.`
    );

    if (updateEventPrompt) {
      const startTimeSplit = id.split("-")[0];
      const eventTypeSplit = id.split("-")[2];
      const studentIdSplit = id.split("-")[3];
      const endTimeSplit = id.split("-")[4];

      var data = {
        endTime: new Date(Number(endTimeSplit)).getTime(),
        eventName: module.eventName,
        eventType: eventTypeSplit,
        startTime: new Date(Number(startTimeSplit)).getTime(),
      };

      let newTimetableData = [];

      newTimetableData = fullData.filter(
        (event) =>
          event.startTime != startTimeSplit ||
          event.eventName != title ||
          event.eventType != type
      );

      newTimetableData = [...newTimetableData];
      newTimetableData.push(data);

      overrideStudentEventsToDB(studentIdSplit, newTimetableData, database);

      setOpen(false);

      toast.success("Event has been updated sucessfully.");
    }
    else {
      setOpen(false);
      toast.success("Updating of event is cancelled.");
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteEvent(id, title, type, module_studentId, fullData) {
    var deleteEventPrompt = window.confirm(
      `Are you sure you want to delete the event?\nYou cannot undo this.`
    );

    if (deleteEventPrompt) {
      const startTimeSplit = id.split("-")[0];
      const endTimeSplit = id.split("-")[4];

      const newData = fullData.filter(
        (event) =>
          event.startTime != startTimeSplit ||
          event.eventName != title ||
          event.eventType != type
        // event.studentId != studentId // update only works on my own modules
      );

      console.log({ startTimeSplit });
      console.log({ endTimeSplit });
      console.log({ title });
      console.log({ type });
      console.log({ module_studentId });
      database
        .ref(`Students/${module_studentId}/events`)
        .orderByChild(`startTime`)
        .equalTo(Number(startTimeSplit))
        .on("child_added", function (snapshot) {
          const module = snapshot.val();
          console.log({ module });
          if (
            module.endTime === Number(endTimeSplit) &&
            module.eventType === type &&
            module.eventName === title
          ) {
            database
              .ref(`Students/${module_studentId}/events`)
              .child(`${snapshot.key}`)
              .remove();
            getStudentGroupEvents(updateGroupModules, myGroups, database);
            console.log("Removed");
          }
        });

      // console.log({ dbResult });

      function checkEvent(key, title, type, endTimeSplit) {
        database
          .ref(`Students/${module_studentId}/events/${key}`)
          .once("value", function (snapshot) {
            console.log(snapshot.val());
          });
      }

      // overrideStudentEventsToDB(studentId, newData, database);

      // reload
      // loadTimetable(updateMyModules, studentId, database);

      // updateMyModules(newData);
      // setRefreshKey(refreshKey + 1);
      setOpen(false);

      toast.success("The event has been deleted successfully.");
    } else {
      setOpen(false);
      toast.success("Deletion of event is cancelled.");
    }
  }

  // useEffect(() => {
  //   setRefreshKey(0);

  //   if (props.triggerMyTimetableForceRefresh !== undefined) {
  //     props.triggerMyTimetableForceRefresh();
  //   }
  // }, [refreshKey]);

  // create a new component for modules
  const modules = data.map((module, index) => {
    const {
      studentId: module_studentId,
      id,
      title,
      type,
      startTime,
      endTime,
    } = module;

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
            style={{
              float: "right",
              borderRadius: "15px",
              boxShadow: "5px 5px 5px 0px grey",
            }}
            color="secondary"
          >
            <ClearIcon fontSize="small" />
          </Button>
        </p>{" "}
        <p>
          <form>
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
              // value={module.title}
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
            ></input>
            <br></br>
            <Button
              onClick={() => updateEvent(id, title, type, fullData)}
              variant="contained"
              style={{ boxShadow: "5px 5px 5px 0px grey" }}
              color="primary"
            >
              <EditIcon fontSize="small" />
              Update
            </Button>
          </form>
        </p>
        <br></br>
        {/* <p>ID: {id}</p> */}
        <p>Event Title: {title}</p>
        <p>Event Status: {type}</p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        <p>Student Id: {module_studentId}</p>
        <br></br>
        <Tooltip
          title={
            <em style={{ fontSize: "12px" }}>
              {"Click here to delete an event"}
            </em>
          }
        >
          <Button
            onClick={() =>
              deleteEvent(id, title, type, module_studentId, fullData)
            }
            variant="contained"
            style={{ boxShadow: "5px 5px 5px 0px grey" }}
            color="primary"
          >
            <DeleteIcon fontSize="small" />
            Delete
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
      </div>
    );

    return (
      <div
        key={`${id}-${index}`}
        style={{
          backgroundColor: pickColour(type),
          boxShadow: "2px 1px 2px grey",
        }}
      >
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
