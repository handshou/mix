import React, { useContext, useState, useMemo, useEffect } from "react";
import { useDatabase } from "../Contexts/DatabaseContext";
import { getStudentGroups } from "../Functions/apiFunctions.js";
import { getCurrentWeek } from "../Components/Timetable/utils";
import { useMaximumWeek } from "../Contexts/WeekContext";

const MyGroupsContext = React.createContext();
const UpdateMyGroupsContext = React.createContext();
const GroupsWeekContext = React.createContext();
const UpdateGroupsWeekContext = React.createContext();

export function useMyGroups() {
  return useContext(MyGroupsContext);
}

export function useUpdateMyGroups() {
  return useContext(UpdateMyGroupsContext);
}

export function useGroupsWeek() {
  return useContext(GroupsWeekContext);
}

export function useUpdateGroupsWeek() {
  return useContext(UpdateGroupsWeekContext);
}

export default function MyGroupsProvider({ children }) {
  const studentId = localStorage.getItem("studentId");
  const database = useDatabase();
  const maximumWeek = useMaximumWeek();
  const initStudentGroups = useMemo(
    () => getStudentGroups(updateMyGroups, studentId, database),
    [studentId, database]
  );
  const [groupsWeek, setGroupsWeek] = useState(
    useMemo(() => getCurrentWeek(), [new Date().getDay()])
  );
  const [myGroups, setMyGroups] = useState(initStudentGroups);
  // custom refhook for go back 1-step, see comment about usePrevious fxn below
  // const prevMyGroups = usePrevious(myGroups);

  // load database listeners
  useEffect(() => {
    const studentGroupRef = database.ref(`Groups/`);
    // subscribe database listeners on all groups
    studentGroupRef?.on(
      "value",
      function (snapshot) {
        const allGroups = snapshot?.val?.();
        updateMyGroups(
          allGroups.filter((group) => {
            if (group.members === undefined) return false;
            if (!Array.isArray(group.members)) return false;
            return group.members.find((memberId) => studentId == memberId);
          })
        );
      },
      function (err) {
        console.error(err);
      }
    );
    // unsubscribe database listeners on component unmount/re-render
    return function cleanup() {
      studentGroupRef.off();
    };
  }, [studentId]);

  function updateMyGroups(groups) {
    setMyGroups(groups);
  }

  function updateGroupsWeek(week) {
    if (week <= 0) setGroupsWeek(1);
    if (week >= maximumWeek) setGroupsWeek(maximumWeek);
    else setGroupsWeek(week);
  }

  // kept comment for potential undo groups feature
  // function usePrevious(value) {
  //   const ref = useRef();
  //   useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // }

  return (
    <MyGroupsContext.Provider value={myGroups}>
      <UpdateMyGroupsContext.Provider value={updateMyGroups}>
        <GroupsWeekContext.Provider value={groupsWeek}>
          <UpdateGroupsWeekContext.Provider value={updateGroupsWeek}>
            {children}
          </UpdateGroupsWeekContext.Provider>
        </GroupsWeekContext.Provider>
      </UpdateMyGroupsContext.Provider>
    </MyGroupsContext.Provider>
  );
}
