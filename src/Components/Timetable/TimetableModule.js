import { React, useState } from "react";
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

const TimetableModule = (props) => {
  const { moduleInfo, index } = props;
  const { studentId, id, title, type, startTime, endTime } = moduleInfo;

  const initialState = {
    studentId: studentId,
    endTime: endTime,
    eventName: title,
    eventType: type,
    startTime: startTime,
  };

  const [module, setModule] = useState(initialState);

  const database = useDatabase();
  const updateGroupModules = useUpdateGroupModules();
  const myGroups = useMyGroups();
  const [modalStyle] = useState(getModalStyle);

  const [open, setOpen] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModule({ ...module, [name]: value });
  };

  function updateEvent(id, title, type, studentId) {
    var updateEventPrompt = window.confirm(
      `Are you sure you want to update the event?\nYou cannot undo this.`
    );

    if (updateEventPrompt) {
      const startTimeSplit = id.split("-")[0];
      const eventTypeSplit = id.split("-")[2];
      const endTimeSplit = id.split("-")[4];
      // console.log({ startTimeSplit });
      // console.log({ endTimeSplit });
      // console.log({ type });
      // console.log({ title });

      const studentEventsRef = database.ref(`Students/${studentId}/events`);
      // this query is flawed, there is edge case if two modules have same
      // start time - server only returns one result
      const studentEventsQuery = studentEventsRef
        .orderByChild(`startTime`)
        .equalTo(Number(startTimeSplit));

      const studentEventsListener = studentEventsQuery.on(
        "child_added",
        function (snapshot) {
          const databaseModule = snapshot.val();
          // console.log({ databaseModule });
          if (
            databaseModule.endTime === Number(endTimeSplit) &&
            databaseModule.eventType === type &&
            databaseModule.eventName === title
          ) {
            studentEventsQuery.off("child_added");
            studentEventsRef.child(`${snapshot.key}`).set({
              ...snapshot.val(),
              eventName: module.eventName,
            });

            // triggers update after execution
            getStudentGroupEvents(updateGroupModules, myGroups, database);
            console.log("[TimetableCell] Update module: Updated");
          } else {
            studentEventsQuery.off("child_added");
            console.log("[TimetableCell] Update module: Module does not match");
          }
        }
      );

      setOpen(false);

      toast.success("Event has been updated sucessfully.");
    } else {
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

  function deleteEvent(id, title, type, studentId) {
    var deleteEventPrompt = window.confirm(
      `Are you sure you want to delete the event?\nYou cannot undo this.`
    );

    if (deleteEventPrompt) {
      const startTimeSplit = id.split("-")[0];
      const endTimeSplit = id.split("-")[4];

      const studentEventsRef = database.ref(`Students/${studentId}/events`);
      // this query is flawed, there is edge case if two modules have same
      // start time - server only returns one result
      const studentEventsQuery = studentEventsRef
        .orderByChild(`startTime`)
        .equalTo(Number(startTimeSplit));
      const studentEventsQueryListener = studentEventsQuery.on(
        "child_added",
        function (snapshot) {
          const databaseModule = snapshot.val();
          if (
            databaseModule.endTime === Number(endTimeSplit) &&
            databaseModule.eventType === type &&
            databaseModule.eventName === title
          ) {
            // turn off listener if found matching event
            studentEventsQuery.off("child_added");
            studentEventsRef.child(`${snapshot.key}`).remove();

            // triggers update after execution
            getStudentGroupEvents(updateGroupModules, myGroups, database);
            console.log("[TimetableCell] Delete module: Removed");
          } else {
            studentEventsQuery.off("child_added");
            console.log("[TimetableCell] Delete module: Module does not match");
          }
        }
      );

      setOpen(false);

      toast.success("The event has been deleted successfully.");
    } else {
      setOpen(false);
      toast.success("Deletion of event is cancelled.");
    }
  }

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
          ></input>
          <br></br>
          <Button
            onClick={() => updateEvent(id, title, type, studentId)}
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
      <p>Student Id: {studentId}</p>
      <br></br>
      <Tooltip
        title={
          <em style={{ fontSize: "12px" }}>
            {"Click here to delete an event"}
          </em>
        }
      >
        <Button
          onClick={() => deleteEvent(id, title, type, studentId)}
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
};

export default TimetableModule;
