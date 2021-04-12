import { React, Fragment, useState, useEffect } from "react";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import { Button, setRef, OutlinedInput } from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mouse } from "@material-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDatabase } from "../Contexts/DatabaseContext";

import {
  EmailShareButton,
  EmailIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LineShareButton,
  LineIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { ExpandLess } from "@material-ui/icons";

import "./Stylesheet/Layout.css";

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
  paper: {
    backgroundColor: "#FFF",
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
  const database = useDatabase();
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
    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/name`
    );
    studentsRef.once("value").then((snapshot) => {
      setStudentName(snapshot.val());
    });
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
      setStudentGroups(tempStudentGroups.reverse());
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
    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
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

  const [memberIdToAdd, setMemberIdToAdd] = useState(-1);

  function handleChangeAddMemberModal(e) {
    var memberId = e.target.value;
    // no more than 1 per input
    if (memberId.includes(",")) {
      toast.error("You are not allowed to enter ,");
      return;
    }
    if (memberId.includes(" ")) {
      toast.error("You are not allowed to enter blank spaces");
      return;
    }
    if (memberId.includes(";")) {
      toast.error("You are not allowed to enter ;");
      return;
    }

    setModalMemberId(memberId);

    //check if this user trying to add himself
    if (parseInt(memberId) == parseInt(studentId)) {
      toast.error("You are not allowed to add your own Student ID");
      setAddMemberDisabled(true);
      return;
    }

    //check if this member is defined in the system
    var newMemberName = getGMN(memberId);
    if (newMemberName === undefined) {
      toast.error("There is no record of this member ID #" + memberId);
      setAddMemberDisabled(true);
      return;
    }

    //check if duplicate member
    let skip = false;
    groupMembers.forEach((groupMemberId) => {
      if (parseInt(memberId) == parseInt(groupMemberId)) {
        toast.error("You are not allowed to add existing group members");
        setAddMemberDisabled(true);
        skip = true;
      }
    });
    if (skip === true) {
      return;
    }

    firebase.app();
    var database = firebase.app().database();
    var studentsRef = database.ref(`Students/${memberId}`);
    studentsRef.once("value").then((snapshot) => {
      if (snapshot.val() === null) {
        toast.error("There is no record of this member ID #" + memberId);
        setAddMemberDisabled(true);
        return;
      }
    });

    setAddMemberDisabled(false);
  }

  const removeAllOtherMembersFromGroup = (groupId) => {   
    if (!firebase.apps.length) {
      database.ref(`Groups/`).child(groupId).child("members").set(groupMembers);
    } else {
      var removeAllMembersPrompt = window.confirm(
        "Are you sure you want to remove all other members from Group ID: #" +
          groupId +
          "?"
      );
      if (!removeAllMembersPrompt) {
        toast.success("Removal of all members has been cancelled.");
        return;
      }
      groupMembers.push(parseInt(localStorage.getItem("studentId")));
      setGroupMembers(groupMembers);

      firebase.app();
      var database = firebase.app().database();
      database.ref(`Groups/`).child(groupId).child("members").set(groupMembers);

      toast.success("All other group members have been removed successfully.");
      setRefreshKey(refreshKey + 1);
    }
  };

  const [modalMemberId, setModalMemberId] = useState();

  let addMemberToGroupUsingModal = () => {
    let newList = [];
    for (var i = 0; i < studentGroups.length; i++) {
      if (studentGroups[i].groupId === addMemberModalGroupId) {
        var membersList = studentGroups[i].members;
        for (var j = 0; j < membersList.length; j++) {
          if (membersList[j] !== undefined) {
            newList.push(membersList[j]);
          }
        }
      }
    }

    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
    }

    newList.push(parseInt(modalMemberId));

    database
      .ref(`Groups/`)
      .child(addMemberModalGroupId)
      .child("members")
      .set(newList)
      .then(() => {
        setGroupMembers([...newList]);
      });

    toast.success(
      "Member ID: " +
        modalMemberId +
        " has been added to Group ID: " +
        addMemberModalGroupId +
        " successfully."
    );
    console.log("newList");
    console.log(newList);

    getGroupMembersInAGroup(addMemberModalGroupId);
    setModalMemberId(undefined);
    getStudentGroups();
  };

  let removeStudentFromGroup = (groupId, removeStudentId) => {
    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
    }
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
          if (membersList[j] !== undefined) {
            tempGroupMembers.push(membersList[j]);
          }
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
      toast.success("Change cancelled.");
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

  const [addMemberModalIsOpen, setAddMemberModalIsOpen] = useState(false);
  const [addMemberModalGroupId, setAddMemberModalGroupId] = useState(-1);
  const [addMemberModalGroupName, setAddMemberModalGroupName] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const openAddMemberModal = (selectedGroupId, selectedGroupName) => {
    getGroupMembersInAGroup(selectedGroupId);
    setAddMemberModalIsOpen(true);
    if (selectedGroupId !== undefined) {
      setAddMemberModalGroupId(selectedGroupId);
    }
    if (selectedGroupId !== undefined) {
      setAddMemberModalGroupName(selectedGroupName);
    }
  };

  const closeAddMemberModal = () => {
    setAddMemberModalIsOpen(false);
    setAddMemberModalGroupId(-1);
    setRefreshKey(refreshKey + 1);
    setModalMemberId(undefined);
    setAddMemberModalGroupName("");
    setLinkCopied(false);
  };
  const history = useHistory();

  const routeChange = () => {
    let path = `ViewArchivedGroups`;
    history.push(path);
  };

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [addMemberDisabled, setAddMemberDisabled] = useState(false);

  return (
    <Paper className={classes.paper} square>
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
                  boxShadow: "5px 5px 5px 0 #bbb",
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
          <div
            style={{
              marginTop: "1%",
              minWidth: 310,
              maxWidth: 310,
              minHeight: 280,
              maxHeight: 280,
            }}
          >
            <Box
              boxShadow={6}
              style={{
                margin: "0% 3%",
                minHeight: 220,
                width: 300,
                maxHeight: 220,
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
            <Box
              boxShadow={6}
              style={{
                margin: "0% 3%",
                marginTop: 10,
                minHeight: 50,
                width: 300,
                maxHeight: 50,
              }}
              className={classes.boxDesign}
            >
              <div
                style={{
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                <Link
                  style={{
                    width: "fit-content",
                    fontSize: "x-large",
                  }}
                  to="/JoinGroup"
                >
                  <h3 style={{ paddingTop: 11, fontWeight: "bold" }}>
                    Join A Group
                  </h3>
                </Link>
              </div>
            </Box>
          </div>
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
                            style={{
                              position: "absolute",
                              borderRadius: "10px",
                              boxShadow: "grey 2px 2px 5px",
                            }}
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
                                onKeyDown={(e) => {
                                  try {
                                    let keypress = e.code;
                                    if (keypress === "Escape") {
                                      undoGroupRename(i);
                                    }
                                  } catch {}
                                }}
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
                                    class="undo_rename_glow"
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
                                      boxShadow: "5px 5px 5px 0 #bbb",
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
                                            boxShadow: "5px 5px 5px 0 #bbb",
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
                                      boxShadow: "5px 5px 5px 0 #bbb",
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
                                    style={{
                                      // width: "fit-content"
                                      boxShadow: "5px 5px 5px 0 #bbb",
                                    }}
                                    onClick={() => {
                                      openAddMemberModal(
                                        group.groupId,
                                        group.groupName
                                      );
                                    }}
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
                                                boxShadow: "5px 5px 5px 0 #bbb",
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
                                          boxShadow: "5px 5px 5px 0 #bbb",
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
                                        style={{
                                          // width: "fit-content"
                                          boxShadow: "5px 5px 5px 0 #bbb",
                                        }}
                                        onClick={() => {
                                          openAddMemberModal(
                                            group.groupId,
                                            group.groupName
                                          );
                                        }}
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
      <Dialog
        open={addMemberModalIsOpen}
        onClose={() => {
          closeAddMemberModal();
        }}
        fullWidth={300}
      >
        <DialogTitle>
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
            <div>
              Add Members for Group #{addMemberModalGroupId}:{" "}
              {addMemberModalGroupName}
            </div>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 30 }}>
              <div style={{ marginBottom: 10 }}>
                Share the following URL to your group mates to invite them to
                the group
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <input
                    style={{
                      flexGrow: 1,
                      marginRight: 20,
                      padding: "4px 4px 4px 4px",
                      borderRadius: "4px",
                      outline: "none",
                      border: "1px solid",
                      backgroundColor: "lightGray",
                    }}
                    value={
                      "http://" +
                      window.location.host +
                      "/JoinGroup/" +
                      addMemberModalGroupId
                    }
                    onFocus={(event) => {
                      event.target.select();
                    }}
                  ></input>
                  <CopyToClipboard
                    text={
                      "Use the link to join my MixTime Group" +
                      "\n" +
                      "http://" +
                      window.location.host +
                      "/JoinGroup/" +
                      addMemberModalGroupId
                    }
                    onCopy={() => {
                      toast.success("The sharing link has been copied");
                      setLinkCopied(true);
                    }}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          width: "fit-content",
                          boxShadow: "5px 5px 5px 0 #bbb",
                        }}
                      >
                        Copy To Clipboard
                      </Button>
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginRight: 15,
                }}
              >
                Share Via:
              </div>
              <div
                style={{
                  marginRight: 15,
                }}
              >
                <WhatsappShareButton
                  style={{
                    borderRadius: "32px",
                    boxShadow: "3px 3px 3px 0 #bbb",
                  }}
                  url={
                    "Use the link to join my MixTime Group" +
                    "\n" +
                    "http://" +
                    window.location.host +
                    "/JoinGroup/" +
                    addMemberModalGroupId
                  }
                >
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
              </div>
              <div
                style={{
                  marginRight: 15,
                }}
              >
                <TelegramShareButton
                  style={{
                    borderRadius: "32px",
                    boxShadow: "3px 3px 3px 0 #bbb",
                  }}
                  url={
                    "Use the link to join my MixTime Group" +
                    "\n" +
                    "http://" +
                    window.location.host +
                    "/JoinGroup/" +
                    addMemberModalGroupId
                  }
                >
                  <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
              </div>
              {/*
              <div
                style={{
                  marginRight: 15,
                }}
              >
                <EmailShareButton
                  url={
                    "Use the link to join my MixTime Group" +
                    "\n" +
                    "http://" +
                    window.location.host +
                    "/JoinGroup/" +
                    addMemberModalGroupId
                  }
                  subject={"Join me on MixTime"}
                  body={
                    "Use the link to join my MixTime Group" +
                    "\n" +
                    "http://" +
                    window.location.host +
                    "/JoinGroup/" +
                    addMemberModalGroupId
                  }
                  separator={" "}
                >
                  <EmailIcon size={32} round={true} />
                </EmailShareButton>
              </div>
            */}
            </div>

            <div style={{ marginBottom: 30 }}>
              Current Members:
              {groupMembers ? JSON.stringify(groupMembers) : "beep"}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{}}>Enter member ID: </div>
              <input
                type="text"
                placeholder="Enter Group Member ID to add"
                style={{
                  flexGrow: 1,
                  marginLeft: 20,
                  marginRight: 20,
                  padding: "4px 4px 4px 4px",
                  borderRadius: "4px",
                  outline: "none",
                  border: "1px solid #da337a",
                  backgroundColor: "initial !important",
                  boxShadow: "0 0 8px 0 #da337a",
                }}
                value={modalMemberId}
                onChange={(e) => {
                  handleChangeAddMemberModal(e);
                  // setModalMemberId(e.target.value);
                }}
              ></input>
              <Button
                disabled={addMemberDisabled === true ? true : false}
                variant="contained"
                color="primary"
                style={{
                  width: "fit-content",
                  boxShadow:
                    addMemberDisabled === true ? "" : "5px 5px 5px 0 #bbb",
                }}
                onClick={() => {
                  addMemberToGroupUsingModal();
                }}
              >
                Add Member
              </Button>
            </div>
            <div>Note: You do not need to add your own ID.</div>
            <div>
              Your ID is displayed on the top right hand corner beside your
              name.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default GroupManagement;
