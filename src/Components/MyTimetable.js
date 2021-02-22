import { React, Fragment, useState, useEffect } from "react";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import { Button } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  firebase.app();
}

const useStyles = makeStyles({
  root: {
    margin: "2%",
    width: "33%",
  },
  media: {
    height: 140,
  },
  cardColumn: {
    padding: "10px",
  },
});

function MyTimetable(props) {
  const classes = useStyles();
  // ========================================================== STUDENTS ==========================================================
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );
  // Purpose: To get total student in the database [Dont delete first]
  // const [totalStudentCount, setTotalStudentCount] = useState();
  // let getTotalStudent = () => {
  //      //Retrieve this to generate new studentID by +1
  //   // var studentsRef = database.ref("Students/");
  //   // studentsRef.once("value").then((snapshot) => {
  //   //   console.log("***snapshot.numChildren()():  " + snapshot.numChildren());
  //   //   // setTotalStudentCount(snapshot.numChildren());
  //   //   setStudentId(snapshot.numChildren() + 1);
  //   //   localStorage.setItem("studentId", snapshot.numChildren() + 1);
  //   //   console.log("***getTotalStudents() 2 :  " + studentId);
  //   //   console.log("***getTotalStudents() 3 :  " + localStorage.getItem("studentId"));
  //   //   // return snapshot.numChildren();
  //   // });
  // }

  let createStudentId = (studentName) => {
    var query = database.ref("Students/").orderByKey();
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
  };

  let getStudentName = (studentId) => {
    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/name`
    );
    studentsRef.once("value").then((snapshot) => {
      setStudentName(snapshot.val());
    });
  };

  // const [studentsList, setStudentList] = useState({});
  // let getStudents = () => {
  //   var studentsRef = database.ref("Students/");
  //   studentsRef.once("value").then((snapshot) => {
  //     snapshot.val() ? setStudentList(snapshot.val()) : console.log("missing");
  //   });
  // };

  // ========================================================== GROUPS ==========================================================
  const [studentGroups, setStudentGroups] = useState([]);
  const [groupId, setGroupId] = useState();
  const [groupMembers, setGroupMembers] = useState([]);

  let getStudentGroups = () => {
    setStudentGroups([]);

    var tempStudentGroups = [];

    // Note: Suddenly not working with this code after database deleted and re-added data
    // var studentGroupRef = database.ref(`Groups/`);
    // studentGroupRef.once("value").then((snapshot) => {
    //   console.log("snapshot: " + JSON.stringify(snapshot));
    //   snapshot.val().forEach((element) => {
    //     if (localStorage.getItem("studentId") != null) {
    //       Object.values(element.members).forEach((studID) => {
    //         if (studID == localStorage.getItem("studentId")) {
    //           // studentGroups.push(element);
    //           tempStudentGroups.push(element);
    //         }
    //       });
    //     }
    //   });

    var studentGroupRef = database.ref(`Groups/`);
    studentGroupRef.once("value").then((snapshot) => {
      var data = snapshot.val();
      for (let index in data) {
        var element = data[index];
        if (localStorage.getItem("studentId") != null) {
          Object.values(element.members).forEach((studID) => {
            if (studID == localStorage.getItem("studentId")) {
              tempStudentGroups.push(element);
            }
          });
        }
      }

      setStudentGroups(tempStudentGroups);
      // localStorage.setItem("studentGroups", studentGroups);
    });
  };

  const [groupMemberName, setGroupMemName] = useState([]);
  let getGroupMemberName = () => {
    setGroupMemName([]);
    var studentNameRef = database.ref("Students/");
    studentNameRef.once("value").then((snapshot) => {
      setGroupMemName(snapshot);
    });
  };

  let getGMN = (studID) => {
    var name = "";
    groupMemberName.forEach((stud) => {
      if (parseInt(stud.key) === parseInt(studID)) {
        name = stud.val().name;
      }
    });
    return name;
  };

  let createGroupId = () => {
    var groupName = prompt("Enter group name");

    var query = firebase.database().ref("Groups/").orderByKey();
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        localStorage.setItem("groupId", parseInt(key) + 1);
        setGroupId(parseInt(key) + 1);
      });
      createGroup(groupName, localStorage.getItem("groupId"));
    });
  };

  let createGroup = (groupName, groupId) => {
    var noOfGroupMembers = prompt("Enter your group size");

    for (var i = 0; i < noOfGroupMembers; i++) {
      var memberId = prompt("Enter member ID");
      groupMembers.push(parseInt(memberId));
    }
    groupMembers.push(parseInt(studentId));
    setGroupMembers(groupMembers);

    var groupsRef = database.ref(`Groups/${localStorage.getItem("groupId")}`);
    groupsRef.child("groupId").set(parseInt(localStorage.getItem("groupId")));
    groupsRef.child("groupName").set(groupName);
    groupsRef.child("members").set(groupMembers);

    toast.success(
      "Group name: " + groupName + " has been created successfully."
    );
    setRefreshKey(refreshKey + 1);
  };

  let addMemberToGroup = (groupId) => {
    for (var i = 0; i < studentGroups.length; i++) {
      if (studentGroups[i].groupId === groupId) {
        var membersList = studentGroups[i].members;
        for (var j = 0; j < membersList.length; j++) {
          groupMembers.push(membersList[j]);
        }
      }
    }
    setGroupMembers(groupMembers);

    var memberId = prompt("Enter member ID");
    groupMembers.push(parseInt(memberId));
    database.ref(`Groups/`).child(groupId).child("members").set(groupMembers);

    toast.success(
      "Member ID: " +
        memberId +
        " has been added to Group ID: " +
        groupId +
        " successfully."
    );
    setRefreshKey(refreshKey + 1);
  };

  let removeStudentFromGroup = (groupId, removeStudentId) => {
    var removeStudentRef = database.ref(`Groups/${groupId}/members/`);
    removeStudentRef.once("value").then((snapshot) => {
      snapshot.forEach((studentID) => {
        if (studentID.val() === removeStudentId) {
          removeStudentRef.child(studentID.key).remove();
        }
      });
    });

    toast.success(
      "Member ID: " +
        removeStudentId +
        " has been removed from Group ID: " +
        groupId +
        " successfully."
    );
    setRefreshKey(refreshKey + 1);
  };

  // ========================================================== EVENTS ==========================================================
  const [studentEvents, setStudentEvents] = useState([
    { endtime: "", eventname: "", eventtype: "", starttime: "" },
  ]);

  let getStudentEvents = (studentId) => {
    var studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.once("value").then((snapshot) => {
      setStudentEvents(snapshot.val());
    });
    console.log("***getStudentEvents():  " + JSON.stringify(studentEvents));
  };

  let addEvent = () => {
    //this event data to be taken from Panna ***
    var newEvent = {
      endtime: "1900",
      eventname: "IS4261 meeting",
      eventtype: "school",
      starttime: "1700",
    };
    // var studentsRef = database.ref(`Students/${studentId}/events/${studentEvents.length}`).push(newEvent);
    var studentsRef = database.ref(`Students/${studentId}/events`);
    if (!Array.isArray(studentEvents) || !studentEvents.length) {
      studentsRef.child(0).set(newEvent);
    } else {
      studentsRef.child(studentEvents.length).set(newEvent);
    }
    console.log("Event inserted into db!");
    setRefreshKey(refreshKey + 1);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey(0);

    if (localStorage.getItem("studentId") == null) {
      var studentName = prompt(
        "Hi! Seems like this is the first time you visited MixTime. \nPlease enter your name and we'll tag it into your timetable."
      );
      createStudentId(studentName);
    } else {
      getStudentName(localStorage.getItem("studentId"));
      getStudentEvents(localStorage.getItem("studentId"));
      localStorage.setItem("studentEvents", studentEvents);
      getStudentGroups();
      getGroupMemberName();
    }
    // if (!Array.isArray(studentEvents) || !studentEvents.length) {
    //   for (var i = 0; i < studentEvents.length; i++) {
    //     console.log("***eventname:  " + studentEvents[i].eventname);
    //     console.log("***eventtype:  " + studentEvents[i].eventtype);
    //     console.log("***endtime:  " + studentEvents[i].endtime);
    //     console.log("***starttime:  " + studentEvents[i].starttime);
    //   }
    // }
  }, [refreshKey]);

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
        Hi,{" "}
        <b>
          {studentName} #({studentId})!
        </b>{" "}
        ================================== GROUPS RELATED
        ==================================
        <br></br>
        Total number of groups you have currently joined: &#9889;{" "}
        {studentGroups.length} &#9889;
        <Button
          variant="contained"
          color="primary"
          style={{ width: "fit-content" }}
          onClick={createGroupId}
        >
          Create New Group
        </Button>
        <div style={{ display: "inherit" }}>
          {studentGroups.map((group, i) => (
            <Card className={classes.root}>
              <div className="cardRow">
                <CardContent className={classes.cardColumn}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      backgroundColor: "#80808026",
                      padding: "2%",
                      overflow: "auto",
                    }}
                  >
                    #{group.groupId} - {group.groupName}
                  </Typography>
                  Other Members:
                  {Object.values(group.members).map((memId, i) => (
                    <div>
                      {memId != localStorage.getItem("studentId") ? (
                        <div>
                          <div style={{ float: "left" }}>
                            <PersonIcon /> Member Id:{" "}
                            {memId + ", " + getGMN(memId)}
                          </div>{" "}
                          .
                          <div style={{ float: "right" }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{
                                width: "fit-content",
                                float: "right",
                                display: "inline",
                              }}
                              onClick={() =>
                                removeStudentFromGroup(group.groupId, memId)
                              }
                            >
                              <RemoveCircleOutlineIcon />
                            </Button>
                          </div>
                          <div style={{ clear: "both" }}></div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </CardContent>

                <CardActions
                  style={{
                    float: "right",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "fit-content" }}
                    onClick={() => addMemberToGroup(group.groupId)}
                  >
                    Add Member
                  </Button>
                </CardActions>
              </div>
            </Card>
          ))}
        </div>
        ================================== EVENTS RELATED
        ==================================
        <br></br>
        You have these events: <br></br>
        <br></br>
        {JSON.stringify(studentEvents)}
        <Button
          variant="contained"
          color="primary"
          style={{ width: "fit-content" }}
          onClick={addEvent}
        >
          Add Event
        </Button>
        <br></br>
        <br></br>
        {/* <div
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
          </div> */}
      </div>
    </Fragment>
  );
}

export default MyTimetable;
