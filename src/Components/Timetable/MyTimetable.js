import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "../../Firebase/firebaseConfig";

// import Button from "@material-ui/core/Button";
// import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import EnterURL from "./EnterURL";
import { shadows } from "@material-ui/system";

import Timetable from "./Timetable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
      boxShadow: "0px 0px 45px 0px #C1C1C1",
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

  useEffect(() => {
    console.log("timetableData");
    console.log(timetableData);
  }, [timetableData]);

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
      <div style={{ justifyContent: "left", padding: "0px 10px 0px 10px", textAlign: "center", position: "absolute", bottom: "480px"}}>
        <h3 style={{ left: "1220px", padding: "15px"}}>Colour Legend</h3>
        <table style={{ display: "flex"}}>
          <tr>
            <th style={{background:'#00d5ff', color:'#000000'}}>Lecture</th>
            <th style={{background:'#008cff', color:'#000000'}}>Tutorial</th>
            <th style={{background:'#00ffe5', color:'#000000'}}>Private</th>
            <th style={{background:'#00fbff', color:'#000000'}}>Others</th>
            <th style={{background:'#FFFFFF', color:'#000000'}}>Available</th>
          </tr>
        </table>
      </div>

      <br></br>
      <div style={{ display: "flex", justifyContent: "center"}}>
        <div className={classes.root}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Week Number
          </div>
          <Pagination
            count={13}
            page={week}
            siblingCount={0}
            onChange={handleChange}
            variant="outlined"
            shape="rounded"
            boundaryCount={2}
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
