import { React, Fragment, useState, useEffect } from "react";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import { Button, setRef } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import { ExitToApp } from "@material-ui/icons";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  // var database = firebase.app().database();
}

const useStyles = makeStyles({
  root: {
    margin: "2%",
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
    var query = firebase.database().ref("Students/").orderByKey();
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        // var childData = childSnapshot.val();
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
    var studentsRef = database.ref(`Students/${studentId}/name`);
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
  const [, setGroupId] = useState();
  const [groupMembers, setGroupMembers] = useState([]);

  let getStudentGroups = () => {
    setStudentGroups([]);

    var studentGroupRef = database.ref(`Groups/`);
    studentGroupRef.once("value").then((snapshot) => {
      snapshot.val().forEach((element) => {
        if (localStorage.getItem("studentId") != null) {
          Object.values(element.members).forEach((studID) => {
            if(studID == localStorage.getItem("studentId")) {
              studentGroups.push(element);
            }            
          });
        }
      });
      setStudentGroups(studentGroups);
      localStorage.setItem("studentGroups", studentGroups);
      console.log(studentGroups);
    });
  };


  const [memberName, setMemberName] = useState("");
  // let matchMembersList = (listOfMembers) => {
  //     listOfMembers.forEach((memId) =>{
  //       var studentsRef = database.ref(`Students/${memId}/name`);
  //       studentsRef.once("value").then((snapshot) => {      
  //         console.log("student name is " + snapshot.val());
  //         setMemberName(snapshot.val());
  //         // console.log("mem name: " + memberName);
  //       })
  //       return memberName;
  //   });
  // };

  
  const [groupMemberName, setGroupMemName] = useState([]);
  let getGroupMemberName = () => {
    setGroupMemName([]);
    var studentNameRef = database.ref("Students/");
    studentNameRef.once("value").then((snapshot) => {
      setGroupMemName(snapshot);
    })
  }
  
  function getGMN(studID) {
    var name = "";
     groupMemberName.forEach((stud) => {
      if(stud.key == parseInt(studID)) {
        name = stud.val().name;
      }
     })
     return name; 
  }
  let createGroupId = () => {
    var groupName = prompt("Enter group name");

    var query = firebase.database().ref("Groups/").orderByKey();
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        // var childData = childSnapshot.val();
        setGroupId(parseInt(key) + 1);
        // localStorage.setItem("groupId", parseInt(key) + 1);
      });
      createGroup(groupName);
    });
  };

  let createGroup = (groupName) => {
    var noOfGroupMembers = prompt("Enter your group size");

    for (var i = 0; i < noOfGroupMembers; i++) {
      var memberId = prompt("Enter member ID");
      groupMembers.push(memberId);
    }
    setGroupMembers(groupMembers);

    var groupsRef = database.ref(`Groups/`);
    groupsRef
      .child(localStorage.getItem("groupId"))
      .child("groupName")
      .set(groupName);

    groupsRef
      .child(localStorage.getItem("groupId"))
      .child("members")
      .set(groupMembers);
    // setRefreshKey(refreshKey + 1);
  };

  let addMemberToGroup = (groupId) => {
    var memberId = prompt("Enter member ID");
    groupMembers.push(parseInt(memberId));
    setGroupMembers(groupMembers);

    var groupsRef = database.ref(`Groups/${groupId}`);
    groupsRef.child("members").set(groupMembers);
  };

  let removeStudentFromGroup = (groupId, removeStudentId) => {
    var removeStudentRef = database.ref(`Groups/${groupId}/members/`);
    removeStudentRef.once("value").then((snapshot) => {
      snapshot.forEach((studentID) => {
        if(studentID.val() === removeStudentId) {
          removeStudentRef.child(studentID.key).remove();
          setRefreshKey(refreshKey + 1);
          //currently, on delete, window reloads... techncially should be just component refresh but oh well :^) 
          window.location.reload();
        }
      });
    });
  }

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

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setRefreshKey(0);
    getGroupMemberName();
    if (localStorage.getItem("studentId") == null) {
      var studentName = prompt(
        "Please enter your name and we'll tag it into your timetable."
      );
      createStudentId(studentName);
    } else {
      getStudentName(localStorage.getItem("studentId"));
      getStudentEvents(localStorage.getItem("studentId"));
      localStorage.setItem("studentEvents", studentEvents);
      getStudentGroups(); 
    }
    if (!Array.isArray(studentEvents) || !studentEvents.length) {
      for (var i = 0; i < studentEvents.length; i++) {
        console.log("***eventname:  " + studentEvents[i].eventname);
        console.log("***eventtype:  " + studentEvents[i].eventtype);
        console.log("***endtime:  " + studentEvents[i].endtime);
        console.log("***starttime:  " + studentEvents[i].starttime);
      }
    }
  }, [refreshKey]);

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
        ====================== GROUPS RELATED ====================== Existing
        groups you are currently joined: <br></br>
        {studentGroups.length}
        <Button
          variant="contained"
          color="primary"
          style={{ width: "fit-content" }}
          onClick={createGroupId}
        >
          Create New Group
        </Button>
        {/* addMemberToGroup */}
        {studentGroups.map((group, i) => (
          <Card className={classes.root}>
            <CardActionArea>
              <div className="cardRow">
                <CardContent className={classes.cardColumn}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      "background-color": "#80808026",
                      padding: "2%",
                      overflow: "auto",
                      height: "100px",
                    }}
                  >
                    #{group.groupId} - {group.groupName}
                    {/* {(groupMembers).forEach((memId) => {
                    return <li>{memId}</li>;
                  })} */}
                  
                  </Typography>          
                  Other Members:   
                  {/* {matchMembersList(group.members)}      */}
                  {(Object.values(group.members)).map((memId, i) => (
                    <div>
                      {/* Student ID: {matchMemberName(memId)} */}         
                      { (memId != localStorage.getItem("studentId")) ?      
                         <div>Student ID: {(memId)+ ", "+getGMN(memId)}
                         <Button
                         variant="contained"
                         color="secondary"
                         style={{width: "fit-content"}}
                         onClick = {() => removeStudentFromGroup(group.groupId, memId)}
                         >
                         Remove Member
                         </Button>
                         </div>
                        :
                        <div></div>
                     }
                    </div>
                  ))}
                </CardContent>
                <CardActions
                  style={{
                    float: "left",
                    "background-color": "#1890ff42",
                    "margin-left": "1%",
                    "margin-top": "0.5%",
                    "font-weight": "bold",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "fit-content" }}
                    onClick={addMemberToGroup}
                  >
                    Add Member
                  </Button>
                </CardActions>
              </div>
            </CardActionArea>
          </Card>
        ))}
        ================ EVENTS RELATED ============================ You have
        these events: <br></br>
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
