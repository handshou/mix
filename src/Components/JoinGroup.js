import { React, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function JoinGroup(props) {
  const [url, setURL] = useState(window.location.href);
  const [groupIdToJoin, setGroupIdToJoin] = useState();
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );
  const [groupData, setGroupData] = useState([]);
  const [toGroupManagement, setToGroupManagement] = useState(false);

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
    var database;
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      database = firebaseApp.database();
    } else {
      // If firebase is already initialized
      firebase.app();
      database = firebase.app().database();
    }

    var studentsRef = database.ref(
      `Students/${localStorage.getItem("studentId")}/name`
    );
    studentsRef.once("value").then((snapshot) => {
      setStudentName(snapshot.val());
    });
  };

  let createStudentId = (studentName) => {
    var database;
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      database = firebaseApp.database();
    } else {
      // If firebase is already initialized
      firebase.app();
      database = firebase.app().database();
    }
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
    var database;
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      database = firebaseApp.database();
    } else {
      // If firebase is already initialized
      firebase.app();
      database = firebase.app().database();
    }
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

  let getGroupMembersOfGroup = async (groupIdToJoin) => {
    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
    }
    var studentGroupRef = database.ref(`Groups/`);
    await studentGroupRef.once("value").then((snapshot) => {
      var data = snapshot.val();
      for (var index in data) {
        var element = data[index];
        if (localStorage.getItem("studentId") != null) {
          if (element !== undefined && element.members !== undefined) {
            if (element.groupId == groupIdToJoin) {
              setGroupData(element);
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    let params = url.split("/");
    let groupIdToJoin = params[params.length - 1];
    if (
      localStorage.getItem("studentId") != null &&
      groupIdToJoin !== undefined
    ) {
      let groupMembers = getGroupMembersOfGroup(groupIdToJoin);
      setGroupIdToJoin(groupIdToJoin);
    }
  }, []);

  const addMemberToGroup = () => {
    var database;
    if (!firebase.apps.length) {
    } else {
      firebase.app();
      var database = firebase.app().database();
    }
    if (groupData !== undefined && groupData.members !== undefined) {
      let groupMembers = groupData.members;
      if (localStorage.getItem("studentId") != null) {
        if (groupMembers !== undefined && groupMembers.length > 0) {
          console.log("passef");
          if (
            groupMembers.includes(parseInt(localStorage.getItem("studentId")))
          ) {
            //already in groupa
            console.log("old groupMembers");
            console.log(groupMembers);
            toast.error("You are already in this group");
          } else {
            groupMembers.push(parseInt(localStorage.getItem("studentId")));
            console.log("new groupMembers");
            console.log(groupMembers);
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {groupData !== undefined &&
        groupData.groupId !== undefined &&
        groupData.members !== undefined ? (
          <div
            style={{
              flexDirection: "column",
            }}
          >
            <div>Joining Group: {groupData.groupId}</div>
            <div>Members: </div>
            {groupData.members.map((memberId, index) => {
              if (memberId !== undefined && memberId !== null)
                return <div>{memberId}</div>;
            })}
            <div>
              <Button
                variant="contained"
                color="default"
                onClick={() => {
                  addMemberToGroup();
                }}
              >
                Join Group
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>{toGroupManagement ? <Redirect to="/GroupManagement" /> : null}</div>
    </div>
  );
}

export default JoinGroup;
