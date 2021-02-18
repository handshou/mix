import { React, Fragment, useState, useEffect } from "react";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import { Button } from "@material-ui/core";

//Copy line 9 to 15 when we need this "connectionString" to reach our firebase
if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

function MyTimetable(props) {
  // ============================= STUDENTS =============================
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [student, setStudent] = useState([]);
  const [studentEvents, setStudentEvents] = useState([
    { endtime: "", eventname: "", eventtype: "", starttime: "" },
  ]);
  // 1. IF studentID NOT in browser memory
  // >> store studentID to browser memory (local storage) AND database

  // 2. IF there is studentID in browser memory
  // (a) no timetable
  // >> can means no retrieval of data because he havent import etc

  // (b) have timetable in the database
  // >> retrieval JUST THAT student record based on this studentID)

  // https://yourapp.firebaseio.com/posts/[the post key]/comments?shallow=true.
  let getTotalStudents = () => {
    //Retrieve this to generate new studentID by +1
    var studentsRef = database.ref("Students/");
    studentsRef.once("value").then((snapshot) => {
      setTotalStudentCount(snapshot.numChildren());
    });
    console.log("***getTotalStudents():  " + totalStudentCount);
  };

  let getStudentEvents = (studentId) => {
    var studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.once("value").then((snapshot) => {
      setStudentEvents(snapshot.val());
    });
    console.log("***getStudentEvents():  " + JSON.stringify(studentEvents));
  };

  useEffect(() => {
    // setStudentId(0); //foor testing purpose set first
    // localStorage.setItem("studentId", 0); //foor testing purpose set first

    getTotalStudents();
    if (localStorage.getItem("studentId") == null) {
      setStudentId(totalStudentCount + 1);
      localStorage.setItem("studentId", studentId);
      console.log(
        "(1)localStorage.getItem(studentId): " +
          localStorage.getItem("studentId")
      );
    } else {
      setStudentId(localStorage.getItem("studentId"));
      localStorage.setItem("studentId", studentId);
      console.log(
        "(2)localStorage.getItem(studentId): " +
          localStorage.getItem("studentId")
      );
      getStudentEvents(localStorage.getItem("studentId"));
      localStorage.setItem("studentEvents", studentEvents);
    }

    if (!Array.isArray(studentEvents) || !studentEvents.length) {
      for (var i = 0; i < studentEvents.length; i++) {
        console.log("***eventname:  " + studentEvents[i].eventname);
        console.log("***eventtype:  " + studentEvents[i].eventtype);
        console.log("***endtime:  " + studentEvents[i].endtime);
        console.log("***starttime:  " + studentEvents[i].starttime);
      }
    }
    // let eventsList = {};
    // for (var key in studentEvents) {
    //   if (studentEvents.hasOwnProperty(key)) {
    //     console.log(key + " -> " + studentEvents[key]);
    //     console.log(typeof studentEvents);
    //     console.log("test!!!" + key[0]);
    //   }
    // }
  }, []);

  let addEvent = () => {
    console.log("Event inserted into db!");
    //this event data to be taken from Panna ***
    var newEvent = {
      endtime: "1900",
      eventname: "IS4261 meeting",
      eventtype: "school",
      starttime: "1700",
    };
    // var studentsRef = database.ref(`Students/${studentId}/events/${studentEvents.length}`).push(newEvent);
    var studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.child(studentEvents.length).set(newEvent);
  };

  let addStudent = () => {
    console.log("Student inserted into db!");
    let studentName = "Tom Lee";
    var studentsRef = database.ref(`Students/`);
    studentsRef
      .child(totalStudentCount + 1)
      .child("name")
      .set(studentName);
  };

  const [studentsList, setStudentList] = useState({});
  let getStudents = () => {
    var studentsRef = database.ref("Students/");
    studentsRef.once("value").then((snapshot) => {
      snapshot.val() ? setStudentList(snapshot.val()) : console.log("missing");
    });
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          wigth: "100%",
          padding: "2%",
        }}
      >
        Student Id ({studentId}) has these events: <br></br>
        {JSON.stringify(studentEvents)}
        <Button
          variant="contained"
          color="primary"
          style={{ width: "fit-content" }}
          onClick={addEvent}
        >
          Add Event
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "fit-content" }}
          onClick={addStudent}
        >
          Add Student
        </Button>
      </div>

      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          wigth: "100%",
        }}
      >
        <div
          style={{
            marginTop: 50,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (getStudents() !== undefined) {
                getStudents();
              } else console.log("lmao it didnt work");
            }}
          >
            Get ALL student information from firebase
          </Button>
        </div>
        <div>
          {studentsList && studentsList.length > 0 ? (
            studentsList.map((val) => {
              return (
                <div>
                  {JSON.stringify(val)} <br></br>
                </div>
              );
            })
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default MyTimetable;
