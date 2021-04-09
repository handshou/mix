import React, { useContext, useState, useEffect, useMemo } from "react";
import { useDatabase } from "./DatabaseContext";
import { useMyModules } from "./MyModulesContext";
import { useMyGroups } from "./MyGroupsContext";
import { getStudentGroupEvents } from "../Functions/apiFunctions.js";

const GroupModulesContext = React.createContext();
const UpdateGroupModulesContext = React.createContext();

export function useGroupModules() {
  return useContext(GroupModulesContext);
}

export function useUpdateGroupModules() {
  return useContext(UpdateGroupModulesContext);
}

export default function GroupModulesProvider({ children }) {
  const studentId = localStorage.getItem("studentId");
  const database = useDatabase();
  const myGroups = useMyGroups();
  const getGroupEvents = useMemo(
    () => getStudentGroupEvents(updateGroupModules, myGroups, database),
    [myGroups, database]
  );
  const [groupModules, setGroupModules] = useState();
  let count = 0;

  // build group modules
  useEffect(() => {
    if (Array.isArray(myGroups)) {
      const buildGroupModules = {};
      myGroups.forEach((myGroup) => {
        buildGroupModules[myGroup.groupId] = {};
        buildGroupModules["length"] = myGroups.length;
        if (myGroup.members && Array.isArray(myGroup.members)) {
          // set length property in group object for members
          buildGroupModules[myGroup.groupId]["length"] = 0;
          myGroup.members.forEach((member) => {
            buildGroupModules[myGroup.groupId][member] = null;
            buildGroupModules[myGroup.groupId]["length"]++;
          });
          // check prevents override after database listeners update member modules
          if (typeof groupModules !== "object") {
            count++;
            setGroupModules((oldGroupModules) => {
              return buildGroupModules;
            });
          }
        }
      });
    }
  }, [myGroups, studentId]);

  // set group modules
  useEffect(() => {
    if (Array.isArray(myGroups)) {
      myGroups.forEach((myGroup) => {
        if (myGroup.members && Array.isArray(myGroup.members))
          myGroup.members.forEach((member) => {
            const eventsRef = database.ref(`Students/${member}/events`);
            eventsRef?.on(
              "value",
              function (events) {
                const conditiontrue =
                  myGroups &&
                  myGroup.members &&
                  groupModules &&
                  groupModules[myGroup.groupId] != undefined &&
                  groupModules[myGroup.groupId] != [] &&
                  groupModules[myGroup.groupId][member] == null &&
                  events?.val?.() != [] &&
                  events != [] &&
                  events != undefined;
                if (conditiontrue) {
                  if (conditiontrue) {
                    setGroupModules((prevGroupModules) => {
                      return (groupModules[myGroup.groupId][member] =
                        events?.val?.() || []);
                    });
                  }
                }
              },
              function (err) {
                console.error(err);
              }
            );
            return function cleanup() {
              eventsRef.off();
            };
          });
      });
    }
  }, [myGroups, studentId]);

  function updateGroupModules(modules) {
    setGroupModules(modules);
  }

  // {
  //   "50": {
  //     "16": [{},{},{}],
  //     "17": [{},{},{}],
  //     length: 2
  //   },
  //   "70": {
  //     "15": [{},{},{}],
  //     "16": [{},{},{}],
  //     length: 2
  //   },
  //   length: 2
  // }

  return (
    <GroupModulesContext.Provider value={groupModules}>
      <UpdateGroupModulesContext.Provider value={updateGroupModules}>
        {children}
      </UpdateGroupModulesContext.Provider>
    </GroupModulesContext.Provider>
  );
}
