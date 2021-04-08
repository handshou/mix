import { React, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import { useDatabase } from "../Contexts/DatabaseContext";
import { getGroupMembersOfGroup } from "../Functions/apiFunctions";
import "react-toastify/dist/ReactToastify.css";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";

toast.configure();

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

function JoinGroup(props) {
  const classes = useStyles();
  const [url, setURL] = useState(window.location.href);
  const [groupIdToJoin, setGroupIdToJoin] = useState();
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );
  const [groupData, setGroupData] = useState([]);
  const [toGroupManagement, setToGroupManagement] = useState(false);
  const [isJoinGroupDisabled, setIsJoinGroupDisabled] = useState(true);
  const [joinGroupUserInput, setJoinGroupUserInput] = useState("");
  const [
    parsedGroupIdFromUserInput,
    setParsedGroupIdFromUserInput,
  ] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const database = useDatabase();

  // help make sure user is logged in
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
    if (props.triggerLayoutForceRefresh !== undefined) {
      props.triggerLayoutForceRefresh();
    }
  };

  useEffect(async () => {
    let params = url.split("/");
    let groupIdToJoin = params[params.length - 1];
    if (
      localStorage.getItem("studentId") != null &&
      groupIdToJoin !== undefined
    ) {
      let groupMembers = await getGroupMembersOfGroup(groupIdToJoin, database);
      setGroupData(groupMembers);
      setGroupIdToJoin(groupIdToJoin);
    }
  }, []);

  const addMemberToGroup = () => {
    if (groupData !== undefined && groupData.members !== undefined) {
      let groupMembers = groupData.members;
      if (localStorage.getItem("studentId") != null) {
        if (groupMembers !== undefined && groupMembers.length > 0) {
          if (
            groupMembers.includes(parseInt(localStorage.getItem("studentId")))
          ) {
            //already in groupa
            toast.error("You are already in this group");
          } else {
            groupMembers.push(parseInt(localStorage.getItem("studentId")));
            database
              .ref(`Groups/`)
              .child(groupIdToJoin)
              .child("members")
              .set(groupMembers);
            toast.success("You have sucessfully joined the group");
            setToGroupManagement(true);
          }
        } else {
          console.log("here");
        }
      }
    }
  };

  // Parse and check user input for numeric group ID
  useEffect(() => {
    if (joinGroupUserInput !== undefined && joinGroupUserInput.length < 1) {
      setIsJoinGroupDisabled(true);
      return;
    }
    // is integer then ok
    if (parseInt(joinGroupUserInput)) {
      setParsedGroupIdFromUserInput(parseInt(joinGroupUserInput));
      setIsJoinGroupDisabled(false);
      return;
    }
    // check url inputs
    // check if mixtime url is part of the included url
    if (!joinGroupUserInput.includes(window.location.host)) {
      setIsJoinGroupDisabled(true);
      setErrorMessage("Wrong URL Entered");
      return;
    }
    // check if is joinGroup url
    if (joinGroupUserInput.split("/JoinGroup/"[1])) {
      let val = joinGroupUserInput.split("/JoinGroup/")[1];
      if (parseInt(val)) {
        setParsedGroupIdFromUserInput(parseInt(val));
        setIsJoinGroupDisabled(false);
        return;
      }
    }

    setErrorMessage("Could not get group number, please check and try again");
    setIsJoinGroupDisabled(true);
  }, [joinGroupUserInput]);

  useEffect(() => {}, [parsedGroupIdFromUserInput]);

  const triggerGroupCheck = async () => {
    if (
      localStorage.getItem("studentId") != null &&
      parsedGroupIdFromUserInput !== undefined
    ) {
      var database;
      if (!firebase.apps.length) {
      } else {
        firebase.app();
        var database = firebase.app().database();
      }
      let groupMembers = await getGroupMembersOfGroup(
        parsedGroupIdFromUserInput,
        database
      );
      if (groupMembers === undefined) {
        toast.error("Group was not found, please check and try again.");
        setErrorMessage("Group was not found, please check and try again.");
      }
      setGroupData(groupMembers);
      setGroupIdToJoin(parsedGroupIdFromUserInput);
    }
  };

  return (
    <div>
      <div
        style={{
          marginTop: "3%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {studentId != undefined &&
        groupData !== undefined &&
        groupData.groupId !== undefined &&
        groupData.members !== undefined ? (
          groupData.members.includes(parseInt(studentId)) ? (
            <Box
              boxShadow={6}
              style={{
                margin: "0% 3%",
                width: "20%",
                backgroundColor: "white",
              }}
              className={classes.boxDesign}
            >
              <Card>
                <CardContent>
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
                    <div>
                      <div></div>Joining Group: #{groupData.groupId}
                    </div>
                  </Typography>
                  <div>You are already in this group </div>
                </CardContent>
                <CardActions
                  style={{
                    float: "left",
                  }}
                >
                  <div styles={{ marginTop: 30, width: "80%" }}>
                    <Button
                      disabled={isJoinGroupDisabled}
                      variant="contained"
                      style={{
                        // width: "fit-content",
                        backgroundColor: "#DC3545",
                        color: "white",
                      }}
                      onClick={() => {
                        setGroupData([]);
                        setGroupIdToJoin(undefined);
                        setJoinGroupUserInput("");
                      }}
                    >
                      Join a different group
                    </Button>
                  </div>
                </CardActions>
                {/*
                <CardActions
                  style={{
                    float: "right",
                  }}
                >
                  <Link to="/GroupManagement">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {}}
                    >
                      Return To Group Management
                    </Button>
                  </Link>
                </CardActions>
                */}
              </Card>
            </Box>
          ) : (
            <Box
              boxShadow={6}
              style={{
                margin: "0% 3%",
                width: "24%",
                backgroundColor: "white",
              }}
              className={classes.boxDesign}
            >
              <Card>
                <div>
                  <CardContent>
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
                      <div
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <div>
                          <div></div>Joining Group: #{groupData.groupId}
                        </div>
                      </div>
                    </Typography>
                    <div>Members: </div>
                    {groupData.members.map((memberId, index) => {
                      if (memberId !== undefined && memberId !== null)
                        return (
                          <div>
                            <PersonIcon /> #{memberId}
                            {/*
                            <PersonIcon /> #{memberId + ", " + "Namelol"}
                          */}
                          </div>
                        );
                    })}
                  </CardContent>
                  <CardActions
                    style={{
                      float: "left",
                    }}
                  >
                    <div styles={{ marginTop: 30, width: "80%" }}>
                      <Button
                        disabled={isJoinGroupDisabled}
                        variant="contained"
                        style={{
                          // width: "fit-content",
                          backgroundColor: "#DC3545",
                          color: "white",
                        }}
                        onClick={() => {
                          setGroupData([]);
                          setGroupIdToJoin(undefined);
                          setJoinGroupUserInput("");
                        }}
                      >
                        Join a different group
                      </Button>
                    </div>
                  </CardActions>
                  <CardActions
                    style={{
                      float: "right",
                    }}
                  >
                    <div styles={{ marginTop: 30, width: "80%" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          addMemberToGroup();
                        }}
                      >
                        Join Group
                      </Button>
                    </div>
                  </CardActions>
                </div>
              </Card>
            </Box>
          )
        ) : (
          <div>
            <Box
              boxShadow={6}
              style={{
                backgroundColor: "white",
              }}
              className={classes.boxDesign}
            >
              <Card style={{ width: 500 }}>
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: 150,
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    Enter Group ID or Join Group URL
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Group ID to join"
                    style={{
                      padding: "4px 4px 4px 4px",
                      borderRadius: "4px",
                      outline: "none",
                      border: "1px solid black",
                      backgroundColor: "initial !important",
                    }}
                    value={joinGroupUserInput}
                    onChange={(e) => {
                      setErrorMessage("");
                      setJoinGroupUserInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      try {
                        let keypress = e.code;
                        if (
                          (keypress === "Enter" ||
                            keypress === "NumpadEnter") &&
                          !isJoinGroupDisabled
                        ) {
                          triggerGroupCheck();
                        }
                      } catch {
                        // do nothing
                      }
                    }}
                  ></input>
                  <div style={{ marginTop: 20, color: "red" }}>
                    {errorMessage !== undefined && errorMessage.length > 1
                      ? errorMessage
                      : ""}
                  </div>
                </CardContent>
                <CardActions
                  style={{
                    float: "right",
                  }}
                >
                  <div styles={{ marginTop: 30, width: "80%" }}>
                    <Button
                      disabled={isJoinGroupDisabled}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        triggerGroupCheck();
                      }}
                    >
                      Find Group
                    </Button>
                  </div>
                </CardActions>
              </Card>
            </Box>
          </div>
        )}
      </div>
      <div>{toGroupManagement ? <Redirect to="/GroupManagement" /> : null}</div>
    </div>
  );
}

export default JoinGroup;
