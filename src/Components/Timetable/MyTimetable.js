import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";

// import Button from "@material-ui/core/Button";
// import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import EnterURL from "./EnterURL";

import Timetable from "./Timetable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function MyTimetable(props) {
  const classes = useStyles();
  const [week, setWeek] = useState(1);
  const [timetableData, setTimetableData] = useState([]);

  let triggerLayoutForceRefresh = () => {};
  if (props.triggerLayoutForceRefresh !== undefined) {
    triggerLayoutForceRefresh = () => {
      props.triggerLayoutForceRefresh();
    };
  }

  let loadTimetable = () => {
    // ensure database is initialised first
    if (!firebase.apps.length) {
      let studentId = localStorage.getItem("studentId");
      if (studentId !== null) {
        var studentsRef = database.ref(`Students/${studentId}/events`);
        studentsRef.once("value").then((snapshot) => {
          setTimetableData(snapshot.val());
        });
      }
    } else {
      firebase.app();
      var database = firebase.app().database();
      let studentId = localStorage.getItem("studentId");
      if (studentId !== null) {
        var studentsRef = database.ref(`Students/${studentId}/events`);
        studentsRef.once("value").then((snapshot) => {
          setTimetableData(snapshot.val());
        });
      }
    }
  };
  let triggerMyTimetableForceRefresh = () => {
    loadTimetable();
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const handleChange = (event, value) => {
    setWeek(value);
  };

  return (
    <div>
      {/* <input accept="image/*" id="contained-button-file" multiple type="file" />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="default"
          component="span"
          startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
      <input accept="image/*" id="icon-button-file" type="file" /> */}
      <br></br>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className={classes.root}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Week Number
          </div>
          <Pagination
            count={13}
            page={week}
            siblingCount={0}
            onChange={handleChange}
          />
        </div>
      </div>
      <br></br>
      <Timetable weekNumber={week} timetableData={timetableData} />
      <br></br>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <EnterURL
          triggerLayoutForceRefresh={() => {
            triggerLayoutForceRefresh();
          }}
          triggerMyTimetableForceRefresh={() => {
            triggerMyTimetableForceRefresh();
          }}
        />
      </div>
    </div>
  );
}
