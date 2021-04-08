import axios from "axios";

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
export const getStudentGroups = async (updateMyGroups, studentId, database) => {
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
  updateMyGroups(tempStudentGroups);
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
    const result = await studentsRef.once("value").then((snapshot) => {
      return snapshot.val();
    });
    // guard condition for no student events
    if (result === null) return;

    // append studentId to each student event
    function addStudentId(studentEvents, studentId) {
      return studentEvents.map((e) => ({ ...e, studentId }));
    }
    return addStudentId(result, studentId);
  }
};

export const getStudentGroupEvents = async (
  updateGroupModules,
  myGroups,
  database
) => {
  const anyGroups =
    myGroups !== null && myGroups !== undefined && myGroups.length > 0;
  const exists = (arrayElement) =>
    arrayElement !== null &&
    arrayElement !== undefined &&
    arrayElement.length > 0;

  if (anyGroups) {
    // hacky way for array of student events per member per group
    let studentEventsPerGroupPerStudent = await Promise.all(
      myGroups.map(async (studentGroup) => {
        let result = {};
        if (!Array.isArray(studentGroup.members)) return;
        const group = await Promise.all(
          studentGroup.members.map(async (memberId) => {
            result[studentGroup.groupId] = {};
            const studentEvents = await getStudentEvents(memberId, database);
            result[studentGroup.groupId][memberId] = studentEvents;
            return result;
          })
        );
        return group;
      })
    );

    // hacky flattening
    const flattened = studentEventsPerGroupPerStudent.map((group) => {
      if (Array.isArray(group)) return group[0];
    });
    let reformatData = {};
    Object.values(flattened).forEach((r) => {
      // hacky method for dirty database
      if (!r) return;
      reformatData[Object.keys(r)[0]] = Object.values(r)[0];
    });

    // this is how reformatData is supposed to look like
    // reformatData = {
    //   // groupId
    //   50: {
    //     // studentId
    //     16: [{mod},{mod},{mod}],
    //     17: [{mod},{mod},{mod}],
    //   },
    //   70: {
    //     15: [{mod},{mod},{mod}],
    //     16: [{mod},{mod},{mod}],
    //   },
    // };

    updateGroupModules(reformatData);
  }
};

export const loadTimetable = (updateMyModules, studentId, database) => {
  function addStudentId(studentEvents, studentId) {
    return studentEvents?.map((e) => ({ ...e, studentId }));
  }
  if (studentId !== null) {
    let studentsRef = database.ref(`Students/${studentId}/events`);
    studentsRef.once("value").then((snapshot) => {
      updateMyModules(addStudentId(snapshot.val(), studentId));
    });
  }
};

export const getStudentName = async (studentId, database) => {
  let studentsRef = database.ref(`Students/${studentId}/name`);
  return await studentsRef.once("value").then((snapshot) => {
    return snapshot.val();
  });
};

export const getGroupMemberName = async (database) => {
  let studentNameRef = database.ref("Students/");
  return await studentNameRef.once("value").then((snapshot) => {
    return snapshot.val();
  });
};
