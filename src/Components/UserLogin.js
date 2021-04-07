import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Button,
  OutlinedInput,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@material-ui/core";

import urlTut from './tutorialGIFs/ImportURL.mp4';
import groupTut from './tutorialGIFs/CreateGroup.mp4';

import { makeStyles } from "@material-ui/core/styles";
import { ChangeHistoryOutlined } from "@material-ui/icons";

//Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Stepper consts
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    backButton: {
      marginRight: theme.spacing(1),
      boxShadow: "grey 5px 5px 5px 0px",
    },
    
    nextButton: {
      boxShadow: "grey 5px 5px 5px 0px",
    },

    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //Step Title
  function getSteps() {
    return [
      "Enter Your MixTime Username",
      "Importing Your NUSMods Timetable",
      "Forming A MixTime Group",
    ];
  }

  function userNameModal() {
    return (
      <div>
        <p>
          It seems like this is the first time here. Please enter your name to begin.
        </p>
        <div>
          Enter Your Name:
          <OutlinedInput required
            placeholder={"e.g, John Doe"}
            defaultValue={localStorage.getItem("inputName")}
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
          <div>
            <Button
              disabled
              className={classes.backButton}
            >
              Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              className={classes.nextButton}
              onClick={() => {
                var value = localStorage.getItem("inputName");
                if (
                  typeof value !== "undefined" &&
                  value !== null &&
                  value !== ""
                ) {
                  dismissAll();
                  handleNext();
                } else {
                  notify();
                }
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function importTimetableModal() {
    return (
      <div> 
            <p>You <b>must</b> import your NUSMods timetable into MixTime, to see it on your MixTime timetable page.</p>
            <br></br>
            <p>To <b>import your timetable</b>, follow these steps:</p>
            <ol>
              <li>1. Click on the "Share/Sync" button.</li>
              <li>2. Click on the Copy icon.</li>
              <li>3. Paste your link into our URL text-box below.</li>
              <li>4. Click on the Update Timetable button.</li>
              <li>5. Your timetable has been successfully added. You can see it from the "My Timetable" tab.</li>
            </ol>
            <br></br>
            <p>See video <b>here</b> for steps:</p>
            <video controls>
              <source src={urlTut} type="video/mp4"/>
            </video>

            <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              className={classes.backButton}
            >
              Back
            </Button>

            <Button
              className={classes.nextButton}
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
      </div>
    );
  }

  function createGroup() {
    return(
      <div>
        <div> 
          <p>You can create a group on MixTime, by adding your group members MixTime IDs. Your own ID is found on the top right corner of the window.</p>
          <br></br>
          <p>To <b>create a group</b>, follow these steps:</p>
            <ol>
              <li>1. Head over to the "Manage Groups" page.</li>
              <li>2. Click on the (+) icon.</li>
              <li>3. A pop-up window will appear, enter your group name first.</li>
              <li>4. Enter your group size (Note, the group size  includes you).</li>
              <li>5. Enter your group members IDs.</li>
            </ol>
            <br></br>
            <p>See video <b>here</b> for steps:</p>
            <video controls>
              <source src={groupTut} type="video/mp4"/>
            </video>
        </div>
        <div>
            <Button
              variant="contained"
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.backButton}
            >
              Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              className={classes.nextButton}
              onClick={() => {
                handleNext();
                handleClose();
                dismissAll();
                createStudentId(localStorage.getItem("inputName"));
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
      </div>
    );}

  //Step Content
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return userNameModal();
      case 1:
        return importTimetableModal();
      case 2:
        return createGroup();
      default:
        return userNameModal();
    }
  }

  //Toast
  const notify = () => {
    toast.error("Please input a name!", {
      position: toast.POSITION.TOP_RIGHT,
      toastId: "001",
    });
  };

  const dismissAll = () => {
    toast.dismiss();
  };

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

  let inputStyle = {
    variant: "contained",
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
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Welcome to MixTime!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <hr></hr>
          <br></br>
          <div>
            {activeStep === steps.length ? (
              <div>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UserLogin;
