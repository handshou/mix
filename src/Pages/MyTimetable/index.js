import { React, useState, useMemo } from "react";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisualTip from "../../Components/VisualTip";

import { makeStyles } from "@material-ui/core/styles";
import {
  useMyModules,
  useMyWeek,
  useUpdateMyWeek,
  useMaximumWeek,
} from "../../Contexts/MyModulesContext";

import {
  Legend,
  EnterURL,
  Timetable,
  WeekSwitcher,
  CreateEvent,
} from "../../Components/Timetable";

import "../../Components/Timetable/timetable.css";

export default function MyTimetable(props) {
  const myWeek = useMyWeek();
  const updateMyWeek = useUpdateMyWeek();
  const myModules = useMyModules();
  const myStudentId = localStorage.getItem("studentId");
  const maximumWeek = useMaximumWeek();

  const legend = useMemo(() => <Legend />, [Legend]);
  const createPersonalEvent = useMemo(() => <CreateEvent />, [myModules]);

  // TO FIX: for new student name force refresh
  const { triggerLayoutForceRefresh } = props;

  // lift week in WeekSwitcher
  const handleWeekChange = (event, value) => {
    // use event as first element, ordering requirement to extract value
    updateMyWeek(value);
  };

  const weekSwitcher = useMemo(
    () => (
      <WeekSwitcher
        handleChange={handleWeekChange}
        week={myWeek}
        maximumWeek={maximumWeek}
      />
    ),
    [myWeek]
  );

  const classes = makeStyles({
    paper: {
      marginTop: "-0.5em",
      backgroundColor: "#FFF",
    },
  })();

  return (
    <Paper className={classes.paper} square>
      {" "}
      <Timetable
        weekNumber={myWeek}
        timetableData={myModules}
        showPrivate={true}
      >
        <div className="header">
          <div id="legend">{legend}</div>
          <div id="week-switcher">{weekSwitcher}</div>
          <div id="action-button">{createPersonalEvent}</div>
        </div>
      </Timetable>
      <div id="url-input">
        <div>
          <Tooltip
            title={
              <div>
                <em style={{ fontSize: "1.2em" }}>
                  {"How to get NUSMods Share/Sync?"}
                </em>
              </div>
            }
          >
            <IconButton>
              <VisualTip />
            </IconButton>
            {/* <HelpIcon fontSize="small" /> */}
          </Tooltip>
        </div>
        <EnterURL
          triggerLayoutForceRefresh={() => {
            triggerLayoutForceRefresh();
          }}
        />
      </div>
    </Paper>
  );
}
