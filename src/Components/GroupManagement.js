import { React, Fragment, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    //width: "25%",
    display: "inline"
  },
  media: {
    height: 140,
  },
  cardColumn: {
    padding: "10px",
  },
});

function GroupManagement(props) {
  const classes = useStyles();
  // ========================================================== STUDENTS ==========================================================
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );

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
    if (!firebase.apps.length) {
      var studentsRef = database.ref(
        `Students/${localStorage.getItem("studentId")}/name`
      );
      studentsRef.once("value").then((snapshot) => {
        setStudentName(snapshot.val());
      });
    } else {
      firebase.app();
      var database = firebase.app().database();
    }
  };

  // ========================================================== GROUPS ==========================================================
  const [studentGroups, setStudentGroups] = useState([]);
  const [, setGroupId] = useState();
  const [groupMembers, setGroupMembers] = useState([]);

  let getStudentGroups = () => {
    setStudentGroups([]);

    var tempStudentGroups = [];

    var studentGroupRef = database.ref(`Groups/`);
    studentGroupRef.once("value").then((snapshot) => {
      var data = snapshot.val();
      for (var index in data) {
        var element = data[index];
        if (localStorage.getItem("studentId") != null) {
          if(element !== undefined && element.members !== undefined) {
          Object.values(element.members).forEach((studID) => {
            if (studID == localStorage.getItem("studentId")) {
              tempStudentGroups.push(element);
            }
          });
        }
        }
      }
      setStudentGroups(tempStudentGroups);
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
    if (groupName == null) {
      toast.success("The creation of group has been cancelled.");
      return;
    }

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
    var noOfGroupMembers = prompt("Enter the number of members you want to add");
    if (noOfGroupMembers == null) {
      toast.success("The creation of group has been cancelled.");
      return;
    }

    if (parseInt(noOfGroupMembers) > 0) {
      for (var i = 0; i < noOfGroupMembers; i++) {
        var memberId = prompt("Enter member ID for member " + (i+1));
        if (memberId == null) {
          toast.success("The creation of group has been cancelled.");
          return;
        }

        if (parseInt(memberId) == parseInt(studentId)) {
          toast.success("You are not allowed to add your own Student ID.");
          return;
        }

        groupMembers.push(parseInt(memberId));
      }
    }

    var groupsRef = database.ref(`Groups/${localStorage.getItem("groupId")}`);
    groupsRef.child("groupId").set(parseInt(localStorage.getItem("groupId")));
    groupsRef.child("groupName").set(groupName);

    groupMembers.push(parseInt(studentId));
    setGroupMembers(groupMembers);
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
    if (memberId == null) {
      toast.success("Member addition has been cancelled.");
      return;
    }

    if (parseInt(memberId) == parseInt(studentId)) {
      toast.success("You are not allowed to add your own Student ID");
      return;
    }

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
        console.log("studentID : " + studentID.val());
        console.log("removeStudentId : " + removeStudentId);
        if (studentID.val() == removeStudentId) {
          removeStudentRef.child(studentID.key).remove();
        }
      });
    });

    if (parseInt(removeStudentId) == parseInt(localStorage.getItem("studentId")))
    {
      toast.success(
        "You have left group" +
          groupId +
          " successfully."
      );
    }
    else {
      toast.success(
        "Member ID: " +
          removeStudentId +
          " has been removed from Group ID: " +
          groupId +
          " successfully."
      );
    }
    
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
      getStudentGroups();
      getGroupMemberName();
    }
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
        <div>
          <div style={{ float: "left" }}>
            You are currently enrolled in {studentGroups.length} groups.
          </div>

          <div style={{ clear: "both" }}></div>

          <div style={{ float: "right" }}>
            Looking to form a new group?{" "}
            <Button
              variant="contained"
              color="primary"
              style={{ width: "fit-content" }}
              onClick={createGroupId}
            >
              Create New Group
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "auto", marginLeft: "10%"}}>
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
                            <PersonIcon /> #{memId + ", " + getGMN(memId)}
                          </div>
                          {"      "}

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
                    onClick={() =>
                      removeStudentFromGroup(
                        group.groupId,
                        localStorage.getItem("studentId")
                      )
                    }
                  >
                    Leave Group
                  </Button>

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
      </div>
    </Fragment>
  );
}

export default GroupManagement;
