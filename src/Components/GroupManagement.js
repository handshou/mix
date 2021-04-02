import { React, Fragment, useState, useEffect } from "react";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import { Button, setRef } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import { shadows } from "@material-ui/system";
import UndoIcon from "@material-ui/icons/Undo";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExpandLess } from "@material-ui/icons";
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

    //check if this memberId exist in the system
    var newMemberName = getGMN(memberId);
    if (newMemberName === undefined) {
      toast.error("There is no record of this member.");
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

  const removeAllOtherMembersFromGroup = (groupId) => {
    groupMembers.push(parseInt(localStorage.getItem("studentId")));
    setGroupMembers(groupMembers);
    if (!firebase.apps.length) {
      database.ref(`Groups/`).child(groupId).child("members").set(groupMembers);
    } else {
      firebase.app();
      var database = firebase.app().database();
      database.ref(`Groups/`).child(groupId).child("members").set(groupMembers);

      var removeAllMembersPrompt = window.confirm(
        "Are you sure you want to remove all other members from Group ID: #" +
          groupId +
          "?"
      );
      if (!removeAllMembersPrompt) {
        toast.success("Removal of all members has been cancelled.");
        return;
      }
      toast.success("All other group members have been removed successfully.");
      setRefreshKey(refreshKey + 1);
    }
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

  const [search, setSearch] = useState("");

  const [filteredStudentGroups, setFilteredStudentGroups] = useState([]);
  const [groupNameTextboxArr, setGroupNameTextboxArr] = useState();
  useEffect(() => {
    var tempArray = [];
    for (var i = 0; i < filteredStudentGroups.length; i++) {
      tempArray.push({
        disable: true,
        groupId: filteredStudentGroups[i].groupId,
        val: filteredStudentGroups[i].groupName,
        readOnly: true,
        allowUndo: false,
      });
    }
    setGroupNameTextboxArr(tempArray);
  }, [studentGroups, filteredStudentGroups]);

  useEffect(() => {
    setFilteredStudentGroups(
      studentGroups.filter((g) => {
        return g.groupName.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, studentGroups]);

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

  const [show, toggleShow] = useState(true);
  const [archivedGroups, setArchivedGroups] = useState([]);

  useEffect(() => {
    getArchivedGroupsFromDB();
  }, []);

  function getArchivedGroupsFromDB() {
    var database = firebase.app().database();
    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/archivedGroups`
    );
    studentsRef.once("value").then((snapshot) => {
      if (snapshot.val() === null) {
        setArchivedGroups([]);
      } else {
        setArchivedGroups(snapshot.val());
      }
    });
  }

  function archiveGroup(groupId) {
    archivedGroups.push(groupId);
    setArchivedGroups(archivedGroups);

    console.log(archivedGroups);
    if (!firebase.apps.length) {
      var studentsRef = database.ref(`Students/`);
      studentsRef
        .child(localStorage.getItem("studentId"))
        .child("archivedGroups")
        .set(archivedGroups);
    } else {
      firebase.app();
      var database = firebase.app().database();
      var studentsRef = database.ref(`Students/`);
      studentsRef
        .child(localStorage.getItem("studentId"))
        .child("archivedGroups")
        .set(archivedGroups);
    }
    setRefreshKey(refreshKey + 1);
    toast.success("You have successfully archived the group.");
  }

  const history = useHistory();

  const routeChange = () => {
    let path = `ViewArchivedGroups`;
    history.push(path);
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
        <div>
          <div style={{ float: "left" }}>
            You are currently enrolled in{" "}
            {studentGroups !== undefined && studentGroups.length !== undefined
              ? studentGroups.length
              : 0}{" "}
            groups.
          </div>
          <div style={{ clear: "both" }}></div>
          <div style={{ float: "right" }}>
            <label style={{ float: "right" }}>
              Filter Groups: &nbsp; &nbsp;
              <input
                type="text"
                placeholder="Enter search term"
                style={{
                  padding: "4px 4px 4px 4px",
                  borderRadius: "4px",
                  outline: "none",
                  border: "1px solid #da337a",
                  boxShadow: "0px 0px 8px #da337a",
                  backgroundColor: "initial !important",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            </label>
            <br></br>
            <Tooltip title={<em>{"Click here to view archived groups"}</em>}>
              <Button
                style={{
                  boxShadow: "5px 5px 5px 0px grey",
                  width: "fit-content",
                }}
                variant="contained"
                color="primary"
                onClick={routeChange}
              >
                <ArchiveIcon /> &nbsp; View Archived Groups
              </Button>
            </Tooltip>
            &nbsp; &nbsp;
            <Tooltip
              title={
                <em>{"Click here to minimize or expand all your groups"}</em>
              }
            >
              <Button
                style={{
                  boxShadow: "5px 5px 5px 0px grey",
                  width: "fit-content",
                }}
                variant="contained"
                color="primary"
                onClick={() => toggleShow(!show)}
              >
                {show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                {show ? "Minimize All Groups" : "Expand All Groups"}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "3% 2% 0% 15%",
          }}
        >
          <Box
            boxShadow={6}
            style={{
              margin: "0% 3%",
              minHeight: "220px",
              width: "24%",
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
                      // minHeight: "170px",
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

          {groupNameTextboxArr !== undefined &&
          filteredStudentGroups !== undefined &&
          groupNameTextboxArr.length === filteredStudentGroups.length ? (
            <div style={{ display: "contents" }}>
              {filteredStudentGroups.map((group, i) => (
                <div style={{ padding: "0.5% 0.5%" }}>
                  {archivedGroups !== undefined &&
                  archivedGroups !== null &&
                  !archivedGroups.includes(group.groupId) ? (
                    <Card
                      className={classes.root}
                      style={{
                        width: "100%",
                        display: "table",
                        // minWidth: "25%",
                        // margin: "0% 10% 10%",
                      }}
                    >
                      <div>
                        <Tooltip
                          title={<em>{"Click here to archive the group"}</em>}
                        >
                          <Link
                            onClick={() => {
                              archiveGroup(group.groupId);
                            }}
                            style={{ position: "absolute" }}
                          >
                            <ArchiveIcon />
                          </Link>
                        </Tooltip>
                        <div style={{ clear: "both" }} />
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
                                minWidth: "250px !important",
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
                              {groupNameTextboxArr[i].readOnly === true ? (
                                <Link
                                  onClick={() => {
                                    enableGroupNameEdit(i);
                                  }}
                                >
                                  <span
                                    style={{ color: "black", float: "right" }}
                                  >
                                    <CreateIcon />
                                  </span>
                                </Link>
                              ) : (
                                <Link
                                  onClick={() => {
                                    updateGroupName(i);
                                  }}
                                >
                                  <span
                                    style={{ color: "black", float: "right" }}
                                  >
                                    <SaveIcon />
                                  </span>
                                </Link>
                              )}
                              {/* Undo group name */}
                              {groupNameTextboxArr[i].allowUndo === true &&
                              localStorage.getItem("originalGroupName") !==
                                groupNameTextboxArr[i].val ? (
                                <span style={{ float: "right" }}>
                                  <Link
                                    onClick={() => {
                                      undoGroupRename(i);
                                    }}
                                  >
                                    <UndoIcon />
                                  </Link>
                                </span>
                              ) : (
                                <span></span>
                              )}
                            </Typography>

                            {show && (
                              <div>
                                Other Members:
                                {Object.values(group.members).map(
                                  (memId, i) => (
                                    <div>
                                      {memId !=
                                      localStorage.getItem("studentId") ? (
                                        <div>
                                          <div style={{ float: "left" }}>
                                            <PersonIcon /> #
                                            {memId + ", " + getGMN(memId)}
                                          </div>
                                          {"      "}

                                          <div style={{ float: "right" }}>
                                            <Link
                                              style={{
                                                width: "fit-content",
                                                float: "right",
                                                display: "inline",
                                                color: "#DC3545",
                                              }}
                                              onClick={() =>
                                                removeStudentFromGroup(
                                                  group.groupId,
                                                  memId
                                                )
                                              }
                                            >
                                              <abbr title="Remove member">
                                                <RemoveCircleOutlineIcon />
                                              </abbr>
                                            </Link>
                                          </div>
                                          <div style={{ clear: "both" }}></div>
                                        </div>
                                      ) : (
                                        <div></div>
                                      )}
                                    </div>
                                  )
                                )}
                                {group.members.length > 2 ? (
                                  <Button
                                    variant="contained"
                                    style={{
                                      // width: "fit-content",
                                      backgroundColor: "#DC3545",
                                      color: "white",
                                      float: "right",
                                    }}
                                    onClick={() =>
                                      removeAllOtherMembersFromGroup(
                                        group.groupId
                                      )
                                    }
                                  >
                                    Remove All Members
                                  </Button>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            )}
                          </CardContent>

                          {show && (
                            <div>
                              <div style={{ padding: "2%" }}>
                                <div>Join Group URL:</div>
                                <div
                                  onClick={() => {
                                    // implement copy to clipboard
                                    // am considering the library react-copy-to-clipboard
                                  }}
                                >
                                  {/* {console.log(window.location.host)} */}
                                  http://{window.location.host}/JoinGroup/
                                  {group.groupId}
                                </div>
                              </div>

                              <div style={{ clear: "both" }} />

                              <div>
                                <CardActions style={{ float: "left" }}>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    style={
                                      group.members.length > 1
                                        ? {
                                            float: "left",
                                            minWidth: "20px",
                                            backgroundColor: "green",
                                            opacity: "0.4",
                                          }
                                        : {
                                            float: "left",
                                            minWidth: "20px",
                                            backgroundColor: "green",
                                            opacity: "1",
                                          }
                                    }
                                    onClick={() =>
                                      deleteGroup(
                                        group.groupId,
                                        group.members.length
                                      )
                                    }
                                    disabled={
                                      group.members.length > 1 ? true : false
                                    }
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
                                    style={{
                                      // width: "fit-content",
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
                                    style={
                                      {
                                        // width: "fit-content"
                                      }
                                    }
                                    onClick={() =>
                                      addMemberToGroup(group.groupId)
                                    }
                                  >
                                    Add Member
                                  </Button>
                                </CardActions>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div></div>
                    </Card>
                  ) : (
                    <div>
                      {archivedGroups === undefined &&
                      archivedGroups === null &&
                      !archivedGroups.includes(group.groupId) ? (
                        <Card
                          className={classes.root}
                          style={{
                            width: "100%",
                            display: "table",
                            // minWidth: "25%",
                            // margin: "0% 10% 10%",
                          }}
                        >
                          <div>
                            <Tooltip
                              title={
                                <em>{"Click here to archive the group"}</em>
                              }
                            >
                              <Link
                                onClick={() => {
                                  archiveGroup(group.groupId);
                                }}
                                style={{ position: "absolute" }}
                              >
                                <ArchiveIcon />
                              </Link>
                            </Tooltip>
                            <div style={{ clear: "both" }} />
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
                                    minWidth: "250px !important",
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
                                            backgroundColor:
                                              "initial !important",
                                          }
                                        : {
                                            width: "50%",
                                            backgroundColor: "initial",
                                          }
                                    }
                                  ></input>
                                  {groupNameTextboxArr[i].readOnly === true ? (
                                    <Link
                                      onClick={() => {
                                        enableGroupNameEdit(i);
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "black",
                                          float: "right",
                                        }}
                                      >
                                        <CreateIcon />
                                      </span>
                                    </Link>
                                  ) : (
                                    <Link
                                      onClick={() => {
                                        updateGroupName(i);
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "black",
                                          float: "right",
                                        }}
                                      >
                                        <SaveIcon />
                                      </span>
                                    </Link>
                                  )}
                                  {/* Undo group name */}
                                  {groupNameTextboxArr[i].allowUndo === true &&
                                  localStorage.getItem("originalGroupName") !==
                                    groupNameTextboxArr[i].val ? (
                                    <span style={{ float: "right" }}>
                                      <Link
                                        onClick={() => {
                                          undoGroupRename(i);
                                        }}
                                      >
                                        <UndoIcon />
                                      </Link>
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </Typography>

                                {show && (
                                  <div>
                                    Other Members:
                                    {Object.values(group.members).map(
                                      (memId, i) => (
                                        <div>
                                          {memId !=
                                          localStorage.getItem("studentId") ? (
                                            <div>
                                              <div style={{ float: "left" }}>
                                                <PersonIcon /> #
                                                {memId + ", " + getGMN(memId)}
                                              </div>
                                              {"      "}

                                              <div style={{ float: "right" }}>
                                                <Link
                                                  style={{
                                                    width: "fit-content",
                                                    float: "right",
                                                    display: "inline",
                                                    color: "#DC3545",
                                                  }}
                                                  onClick={() =>
                                                    removeStudentFromGroup(
                                                      group.groupId,
                                                      memId
                                                    )
                                                  }
                                                >
                                                  <abbr title="Remove member">
                                                    <RemoveCircleOutlineIcon />
                                                  </abbr>
                                                </Link>
                                              </div>
                                              <div
                                                style={{ clear: "both" }}
                                              ></div>
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </CardContent>

                              {show && (
                                <div>
                                  <div style={{ padding: "2%" }}>
                                    <div>Join Group URL:</div>
                                    <div
                                      onClick={() => {
                                        // implement copy to clipboard
                                        // am considering the library react-copy-to-clipboard
                                      }}
                                    >
                                      {/* {console.log(window.location.host)} */}
                                      http://{window.location.host}/JoinGroup/
                                      {group.groupId}
                                    </div>
                                  </div>

                                  <div style={{ clear: "both" }} />

                                  <div>
                                    <CardActions style={{ float: "left" }}>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        style={
                                          group.members.length > 1
                                            ? {
                                                float: "left",
                                                minWidth: "20px",
                                                backgroundColor: "green",
                                                opacity: "0.4",
                                              }
                                            : {
                                                float: "left",
                                                minWidth: "20px",
                                                backgroundColor: "green",
                                                opacity: "1",
                                              }
                                        }
                                        onClick={() =>
                                          deleteGroup(
                                            group.groupId,
                                            group.members.length
                                          )
                                        }
                                        disabled={
                                          group.members.length > 1
                                            ? true
                                            : false
                                        }
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
                                        style={{
                                          // width: "fit-content",
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
                                        style={
                                          {
                                            // width: "fit-content"
                                          }
                                        }
                                        onClick={() =>
                                          addMemberToGroup(group.groupId)
                                        }
                                      >
                                        Add Member
                                      </Button>
                                    </CardActions>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div></div>
                        </Card>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default GroupManagement;
