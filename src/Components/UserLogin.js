import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button, OutlinedInput } from "@material-ui/core";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

export function UserLogin(props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentName, setStudentName] = useState(localStorage.getItem("studentName"));
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setRefreshKey(0);
    if (localStorage.getItem("studentId") == null) {
      handleShow();
    } else {
      getStudentName(localStorage.getItem("studentId"));
    }
  }, [refreshKey]);

  let getStudentName = (studentId) => {
    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/name`
    );
    studentsRef.once("value").then((snapshot) => {
      setStudentName(snapshot.val());
    });
  };

  let createStudentId = (studentName) => {
    console.log("studentName: " + studentName);
    var query = database.ref("Students/").orderByKey();

    console.log("1: " + query);
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        setStudentId(parseInt(key) + 1);
        localStorage.setItem("studentId", parseInt(key) + 1);
      });
      createStudentRecord(studentName);
    });
  };

  let createStudentRecord = (studentName) => {
    var studentsRef = database.ref(`Students/`);
    studentsRef
      .child(localStorage.getItem("studentId"))
      .child("name")
      .set(studentName);
    setRefreshKey(refreshKey + 1);
    localStorage.setItem("studentName", studentName);

    if (props.triggerNameRefresh !== undefined) {
      props.triggerNameRefresh();
    }
  };

  return (
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Welcome to MixTime!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            It seems like this is the first time you visited MixTime. Please
            enter your name to begin.
          </p>
          <div>
            Enter Your Name:
            <OutlinedInput
              placeholder={"John Doe"}
              style={{
                width: 300,
                marginLeft: 30,
                marginRight: 30,
                marginTop: 20,
              }}
              onChange={(name) => {
                localStorage.setItem("inputName", name.target.value);
              }}
            ></OutlinedInput>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              createStudentId(localStorage.getItem("inputName"));
              handleClose();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default UserLogin;