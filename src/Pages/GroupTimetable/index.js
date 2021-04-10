import { React, Fragment, useState, useMemo } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import Tabs from "@material-ui/core/Tabs";
import TabPanel from "@material-ui/lab/TabPanel";

import { makeStyles } from "@material-ui/core/styles";

import {
  useMyGroups,
  useGroupsWeek,
  useUpdateGroupsWeek,
} from "../../Contexts/MyGroupsContext";
import { useGroupModules } from "../../Contexts/GroupModulesContext";
import { useMyModules } from "../../Contexts/MyModulesContext";

import {
  Timetable,
  WeekSwitcher,
  Legend,
  CreateEvent,
} from "../../Components/Timetable";

export default function GroupTimetable(props) {
  const myModules = useMyModules();
  const myGroups = useMyGroups();
  const groupsWeek = useGroupsWeek();
  const updateGroupsWeek = useUpdateGroupsWeek();
  const [value, setValue] = useState(0);
  const studentEvents = useGroupModules();

  const handleWeekChange = (event, value) => {
    // use event as first element, ordering requirement to extract value
    updateGroupsWeek(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const anyGroups =
    myGroups !== null && myGroups !== undefined && myGroups.length > 0;

  const legend = useMemo(() => <Legend />, [Legend]);
  const createPersonalEvent = useMemo(
    () => <CreateEvent myGroup={Object.values(myGroups)[value]} />,
    [value, myModules]
  );
  const weekSwitcher = useMemo(
    () => <WeekSwitcher handleChange={handleWeekChange} week={groupsWeek} />,
    [groupsWeek]
  );

  const classes = makeStyles({
    paper: {
      marginTop: "-0.5em",
      backgroundColor: "#FFF",
    },
  })();

  return (
    <Fragment>
      <Paper className={classes.paper} square>
        {anyGroups && (
          <div className="header">
            <div id="legend">{legend}</div>
            <div id="week-switcher">{weekSwitcher}</div>
            <div id="action-button">{createPersonalEvent}</div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            wigth: "100%",
          }}
        >
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="Project Group Tabs"
            centered
          >
            {anyGroups ? (
              myGroups.map((studentGroup) => {
                return (
                  <Tab
                    key={studentGroup.groupId}
                    label={studentGroup.groupName}
                    id={studentGroup.groupId}
                  />
                );
              })
            ) : (
              <Tab label="No Groups" />
            )}
          </Tabs>
          <TabContext value={JSON.stringify(value)}>
            {anyGroups && studentEvents ? (
              myGroups.map((studentGroup, index) => {
                return (
                  <TabPanel
                    key={studentGroup.groupId}
                    value={JSON.stringify(index)}
                  >
                    {studentEvents[studentGroup.groupId] !== undefined ? (
                      <Timetable
                        key={studentGroup.groupId}
                        weekNumber={groupsWeek}
                        timetableData={studentEvents[studentGroup.groupId]}
                      />
                    ) : (
                      <div>No events found</div>
                    )}
                  </TabPanel>
                );
              })
            ) : (
              <div />
            )}
          </TabContext>
        </div>
      </Paper>
    </Fragment>
  );
}
