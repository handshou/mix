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
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import { shadows } from "@material-ui/system";
import UndoIcon from "@material-ui/icons/Undo";
import DeleteIcon from "@material-ui/icons/Delete";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mouse } from "@material-ui/icons";
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
    display: "inline",
  },
  media: {
    height: 140,
  },
  cardColumn: {
    padding: "10px",
  },
  boxDesign: {
    transition: "all 0.3s ease 0s",
    "&:hover": {
      boxShadow: "0px 10px 15px #ff5942",
      transform: "translateY(-7px)",
    },
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

    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
    }

    var studentGroupRef = database.ref(`Groups/`);
    studentGroupRef.once("value").then((snapshot) => {
      var data = snapshot.val();
      for (var index in data) {
        var element = data[index];
        if (localStorage.getItem("studentId") != null) {
          if (element !== undefined && element.members !== undefined) {
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
    if (!firebase.apps.length) {
      var studentNameRef = database.ref("Students/");
      studentNameRef.once("value").then((snapshot) => {
        setGroupMemName(snapshot);
      });
    } else {
      firebase.app();
      var database = firebase.app().database();
      var studentNameRef = database.ref("Students/");
      studentNameRef.once("value").then((snapshot) => {
        setGroupMemName(snapshot);
      });
    }
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
      //only create group entry without other members
      groupMembers.push(parseInt(studentId)); //to set this will always be key = 0, to prevent error undefined members.0
      var groupsRef = database.ref(`Groups/${localStorage.getItem("groupId")}`);
      groupsRef.child("groupId").set(parseInt(localStorage.getItem("groupId")));
      groupsRef.child("groupName").set(groupName);
      setGroupMembers(groupMembers);
      groupsRef.child("members").set(groupMembers);
      toast.success(
        "Group name: " + groupName + " has been created successfully."
      );
      setRefreshKey(refreshKey + 1);
    });
  };

  //create group entry with other members
  // let createGroup = (groupName, groupId) => {
  //   var noOfGroupMembers = prompt("Enter the number of members you want to add");
  //   if (noOfGroupMembers == null) {
  //     toast.success("The creation of group has been cancelled.");
  //     return;
  //   }

  //   groupMembers.push(parseInt(studentId)); //to set this will always be key = 0, to prevent error undefined members.0
  //   if (parseInt(noOfGroupMembers) > 0) {
  //     for (var i = 0; i < noOfGroupMembers; i++) {
  //       var memberId = prompt("Enter member ID for member " + (i+1));
  //       if (memberId == null) {
  //         toast.success("The creation of group has been cancelled.");
  //         return;
  //       }

  //       if (parseInt(memberId) == parseInt(studentId)) {
  //         toast.success("You are not allowed to add your own Student ID.");
  //         return;
  //       }

  //       groupMembers.push(parseInt(memberId));
  //     }
  //   }

  //   var groupsRef = database.ref(`Groups/${localStorage.getItem("groupId")}`);
  //   groupsRef.child("groupId").set(parseInt(localStorage.getItem("groupId")));
  //   groupsRef.child("groupName").set(groupName);

  //   // groupMembers.push(parseInt(studentId));
  //   setGroupMembers(groupMembers);
  //   groupsRef.child("members").set(groupMembers);

  //   toast.success(
  //     "Group name: " + groupName + " has been created successfully."
  //   );
  //   setRefreshKey(refreshKey + 1);
  // };

  let addMemberToGroup = (groupId) => {
    for (var i = 0; i < studentGroups.length; i++) {
      if (studentGroups[i].groupId === groupId) {
        var membersList = studentGroups[i].members;
        for (var j = 0; j < membersList.length; j++) {
          if (membersList[j] !== undefined) {
            groupMembers.push(membersList[j]);
          }
        }
      }
    }
    setGroupMembers(groupMembers);

    var memberId = prompt(
      "Enter member ID.\nNote: You do not need to add your own ID. \nYour ID is displayed on the top right hand corner beside your name."
    );
    if (memberId == null) {
      toast.success("Member addition has been cancelled.");
      return;
    }

    if (parseInt(memberId) == parseInt(studentId)) {
      toast.error("You are not allowed to add your own Student ID");
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
    getGroupMembersInAGroup(groupId);
    setRefreshKey(refreshKey + 1);
  };

  let removeStudentFromGroup = (groupId, removeStudentId) => {
    //Leave Group
    if (
      parseInt(removeStudentId) == parseInt(localStorage.getItem("studentId"))
    ) {
      var leaveGroupPrompt = window.confirm(
        `Are you sure you want to leave the group? Leaving a group means all members will stay, but only you are removed.\n\nYou will not be able to view the group related information anymore.`
      );
      if (leaveGroupPrompt) {
        var removeStudentRef = database.ref(`Groups/${groupId}/members/`);
        removeStudentRef.once("value").then((snapshot) => {
          snapshot.forEach((studentID) => {
            if (studentID.val() == removeStudentId) {
              removeStudentRef.child(studentID.key).remove();
            }
          });
        });
      } else {
        return;
      }
    } else {
      //Remove student

      var removeStudentPrompt = window.confirm(
        `Are you sure you want to remove ${getGMN(
          removeStudentId
        )} (#${removeStudentId}) from the group?\n\nThe member will no longer be able to see the group related information.`
      );
      if (removeStudentPrompt) {
        var removeStudentRef = database.ref(`Groups/${groupId}/members/`);
        removeStudentRef.once("value").then((snapshot) => {
          snapshot.forEach((studentID) => {
            if (studentID.val() == removeStudentId) {
              removeStudentRef.child(studentID.key).remove();
            }
          });
        });
      } else {
        return;
      }
    }
    if (
      parseInt(removeStudentId) == parseInt(localStorage.getItem("studentId"))
    ) {
      toast.success("You have left group" + groupId + " successfully.");
    } else {
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

  let getGroupMembersInAGroup = (groupId) => {
    setGroupMembers([]);

    var tempGroupMembers = [];

    for (var i = 0; i < studentGroups.length; i++) {
      if (studentGroups[i].groupId === groupId) {
        var membersList = studentGroups[i].members;
        for (var j = 0; j < membersList.length; j++) {
          groupMembers.push(membersList[j]);
        }
      }
    }
    setGroupMembers(tempGroupMembers);
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
      getGroupMembersInAGroup();
    }
  }, [refreshKey]);

  const [groupNameTextboxArr, setGroupNameTextboxArr] = useState();
  useEffect(() => {
    var tempArray = [];
    for (var i = 0; i < studentGroups.length; i++) {
      tempArray.push({
        disable: true,
        groupId: studentGroups[i].groupId,
        val: studentGroups[i].groupName,
        readOnly: true,
        allowUndo: false,
      });
    }
    setGroupNameTextboxArr(tempArray);
  }, [studentGroups]);

  const [selectedCardNumber, setSelectedCardNumber] = useState();

  function editGroupName(event) {
    var groupNameInput = event.target.value;

    var newArr = [...groupNameTextboxArr];
    newArr[selectedCardNumber] = {
      ...newArr[selectedCardNumber],
      disable: false,
      val: groupNameInput,
      allowUndo: false,
    };
    setGroupNameTextboxArr(newArr);
  }

  function enableGroupNameEdit(cardNumber) {
    var newArr = [...groupNameTextboxArr];
    newArr[cardNumber] = {
      ...newArr[cardNumber],
      disable: false,
      readOnly: false,
      allowUndo: false,
    };
    setGroupNameTextboxArr(newArr);
    setSelectedCardNumber(cardNumber);

    localStorage.setItem("originalGroupName", newArr[cardNumber].val);
  }

  function updateGroupName(cardNumber) {
    var newArr = [...groupNameTextboxArr];
    newArr[cardNumber] = {
      ...newArr[cardNumber],
      disable: true,
      readOnly: true,
      allowUndo: true,
    };
    setGroupNameTextboxArr(newArr);

    if (
      groupNameTextboxArr[cardNumber].val !==
      localStorage.getItem("originalGroupName")
    ) {
      toast.success("Group name has been updated successfully.");
    }
    //To update in firebase for real logic [now is just update in client side]
  }

  function undoGroupRename(cardNumber) {
    setRefreshKey(1);
    var newArr = [...groupNameTextboxArr];
    newArr[cardNumber] = {
      ...newArr[cardNumber],
      disable: true,
      readOnly: true,
      allowUndo: false,
      val: localStorage.getItem("originalGroupName"),
    };

    if (
      groupNameTextboxArr[cardNumber].val ===
      localStorage.getItem("originalGroupName")
    ) {
      toast.success("Undo change cancelled.");
    } else {
      toast.success("You have successfully undo changes on group rename.");
    }
    localStorage.setItem("originalGroupName", null);
    setGroupNameTextboxArr(newArr);
    //To update in firebase for real logic [now is just update in client side]
  }

  function deleteGroup(groupId, sizeOfGroup) {
    if (sizeOfGroup > 1) {
      //logged in user himself
      toast.warning(
        "You are not allowed to delete a group with members inside."
      );
    } else if (sizeOfGroup === 1) {
      var leaveGroupPrompt = window.confirm(
        `Are you sure you want to delete the group?\nYou cannot undo this.`
      );

      if (leaveGroupPrompt) {
        database.ref(`Groups/`).child(groupId).remove();
        toast.success("You have successfully deleted the group.");
        setRefreshKey(refreshKey + 1);
      } else {
        toast.success("Deletion of group is cancelled.");
      }
    }
  }

  return (
    <Fragment>
      {groupNameTextboxArr !== undefined &&
      groupNameTextboxArr.length === studentGroups.length ? (
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
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // margin: "auto",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box
              boxShadow={6}
              style={{
                margin: "2%",
                minHeight: "220px",
                width: "25%",
                maxHeight: "220px",
              }}
              className={classes.boxDesign}
            >
              <Card className={classes.root}>
                <div className="cardRow">
                  <CardContent className={classes.cardColumn}>
                    <div
                      style={{
                        margin: "auto",
                        textAlign: "center",
                        fontSize: "x-large",
                        minHeight: "170px",
                      }}
                    >
                      <Link
                        style={{ width: "fit-content" }}
                        onClick={createGroupId}
                      >
                        <AddIcon style={{ width: "200px", height: "100px" }} />
                        <br></br>
                        <h3 style={{ fontWeight: "bold" }}>Create New Group</h3>
                      </Link>
                    </div>
                  </CardContent>
                  <CardActions></CardActions>
                </div>
              </Card>
            </Box>

            {studentGroups.map((group, i) => (
              <Card
                className={classes.root}
                style={{
                  width: "20%",
                  display: "table",
                  minWidth: "25%",
                }}
              >
                <div className="cardRow">
                  <CardContent
                    className={classes.cardColumn}
                    style={{ minHeight: "170px" }}
                  >
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
                      #{groupNameTextboxArr[i].groupId} -{" "}
                      <input
                        type="text"
                        disabled={groupNameTextboxArr[i].disable}
                        value={groupNameTextboxArr[i].val}
                        onChange={editGroupName}
                        readOnly={groupNameTextboxArr[i].readOnly}
                        size={groupNameTextboxArr[i].val.length - 2}
                        style={
                          groupNameTextboxArr[i].readOnly === false
                            ? {
                                padding: "4px 4px 4px 4px",
                                borderRadius: "4px",
                                outline: "none",
                                border: "1px solid #da337a",
                                boxShadow: "0px 0px 8px #da337a",
                                backgroundColor: "initial !important",
                              }
                            : {
                                width: "50%",
                                backgroundColor: "initial",
                              }
                        }
                      ></input>
                      {
                        groupNameTextboxArr[i].readOnly === true ? (
                          //   <Button
                          //   variant="contained"
                          //   color="primary"
                          //   style={{ width: "fit-content" }}
                          // >
                          <Link
                            onClick={() => {
                              enableGroupNameEdit(i);
                            }}
                          >
                            <span style={{ color: "black", float: "right" }}>
                              {/* <abbr title="Edit Student Name"><CreateIcon/></abbr> */}
                              <CreateIcon />
                            </span>
                          </Link>
                        ) : (
                          // </Button>
                          //   <Button
                          //   variant="contained"
                          //   color="primary"
                          //   style={{ width: "fit-content" }}
                          // >
                          <Link
                            onClick={() => {
                              updateGroupName(i);
                            }}
                          >
                            <span style={{ color: "black", float: "right" }}>
                            {/* <abbr title="Save Changes"><SaveIcon /></abbr> */}
                              <SaveIcon />
                            </span>
                          </Link>
                        )
                        // </Button>
                      }
                      {/* For Iteration 2 - Please do not delete! */}
                      {/* {groupNameTextboxArr[i].allowUndo === true && localStorage.getItem("originalGroupName") !== groupNameTextboxArr[i].val ? (
                        <span style={{ float: "right" }}>
                          <Link
                            onClick={() => {
                              undoGroupRename(i);
                            }}
                          >np
                            <UndoIcon />
                          </Link>
                        </span>
                      ) : (
                        <span></span>
                      )} */}
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
                              {/* <Button
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
                              </Button> */}

                              {/* Change to just icon (without red button) after Iteration 1 Screenshots, to uncomment codes below*/}
                              <Link
                                style={{
                                  width: "fit-content",
                                  float: "right",
                                  display: "inline",
                                  color: "#DC3545",
                                }}
                                onClick={() =>
                                  removeStudentFromGroup(group.groupId, memId)
                                }
                              >
                                <abbr title="Remove member"><RemoveCircleOutlineIcon /></abbr>
                              </Link>
                            </div>
                            <div style={{ clear: "both" }}></div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    ))}
                  </CardContent>

                  <div style={{ padding: "2%" }}>
                    <div>Join Group URL:</div>
                    <div
                      onClick={() => {
                        // implement copy to clipboard
                        // am considering the library react-copy-to-clipboard
                      }}
                    >
                      {console.log(window.location.host)}
                      http://{window.location.host}/JoinGroup/
                      {group.groupId}
                    </div>
                  </div>

                  <div style={{ clear: "both" }} />

                  <CardActions style={{ float: "left" }}>
                    {/* <Link
                      style={{
                        width: "fit-content",
                        display: "inline",
                      }}
                      onClick={() => deleteGroup(group.groupId)}
                    >
                      <DeleteIcon style={{ width: "35", height: "35" }} />
                    </Link> */}

                    <Button
                      variant="contained"
                      style={{
                        float: "right",
                        display: "inline",
                        minWidth: "30px",
                      }}
                      onClick={() => deleteGroup(group.groupId, (group.members).length)}
                      disabled = {(group.members).length > 1 ? true : false}
                    >
                      <DeleteIcon />
                    </Button>
                  </CardActions>

                  <CardActions
                    style={{
                      float: "right",
                    }}
                  >
                    <Button
                      variant="contained"
                      //color="primary"
                      style={{
                        width: "fit-content",
                        backgroundColor: "#DC3545",
                        color: "white",
                      }}
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
      ) : (
        <div></div>
      )}
    </Fragment>
  );
}

export default GroupManagement;
