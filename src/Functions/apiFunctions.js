import axios from "axios";
import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
}

// obtained from https://api.nusmods.com/v2/
const apiEndPoint = "https://api.nusmods.com/v2";

// will have to implement some way of updating this information
const acadYear = "2020-2021";

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

// converts valid NUSMODS modulecode into api
// /{acadYear}/modules/{moduleCode}.json
export const getModDetails = async (moduleCode) => {
  let url = apiEndPoint + "/" + acadYear + "/modules/" + moduleCode + ".json";

  const response = await axios.get(url).then((res) => {
    return res.data;
  });
  return await response;
};

// (studentID, newEventArray, OldEventArray, firebaseDBObject)
export const addStudentEventsToDB = (
  studentId,
  eventArray,
  existingEvents,
  database
) => {
  // merge event lists
  var mergedArray = [];
  if (
    existingEvents !== undefined &&
    existingEvents !== null &&
    existingEvents.length > 0
  ) {
    var mergedArray = [...eventArray, ...existingEvents];
  } else {
    mergedArray = eventArray;
  }
  let uniqueArray = [];
  // remove duplicates
  mergedArray.forEach((event) => {
    for (var i = 0; i <= uniqueArray.length; i++) {
      if (i === uniqueArray.length) {
        uniqueArray.push(event);
      }
      if (shallowEqual(uniqueArray[i], event)) {
        break;
      }
    }
  });

  var studentsRef = database.ref(`Students/${studentId}/events`);
  studentsRef.set(uniqueArray);
};

// (studentID, eventArray, firebaseDBObject)
// Overides list of events for student
export const overrideStudentEventsToDB = (studentId, eventArray, database) => {
  var studentsRef = database.ref(`Students/${studentId}/events`);
  studentsRef.set(eventArray);
};

// takes in a studentId,
// returns an array of all the student's groups.
export const getStudentGroups = async (studentId, database) => {
  var tempStudentGroups = [];
  var studentGroupRef = database.ref(`Groups/`);

  await studentGroupRef.once("value").then((snapshot) => {
    var data = snapshot.val();
    for (var index in data) {
      var element = data[index];
      if (studentId !== null) {
        if (element !== undefined && element.members !== undefined) {
          Object.values(element.members).forEach((studID) => {
            if (studID == studentId) {
              tempStudentGroups.push(element);
            }
          });
        }
      }
    }
  });
  return tempStudentGroups;
};

// Takes in a group ID to get the details of the group
// returns a group members of the group
export const getGroupMembersOfGroup = async (groupId, database) => {
  var studentGroupRef = database.ref(`Groups/`);
  let listofMembers = await studentGroupRef.once("value").then((snapshot) => {
    var data = snapshot.val();
    for (var index in data) {
      var element = data[index];
      if (localStorage.getItem("studentId") != null) {
        if (element !== undefined && element.members !== undefined) {
          if (element.groupId == groupId) {
            return element;
          }
        }
      }
    }
  });
  return listofMembers;
};

export const getStudentEvents = async (studentId, database) => {
  if (studentId !== null) {
    var studentsRef = database.ref(`Students/${studentId}/events`);
    return studentsRef.once("value").then((snapshot) => {
      return snapshot.val();
    });
  }
};
