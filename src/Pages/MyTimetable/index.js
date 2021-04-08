import { React, useState, useMemo } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  useMyModules,
  useMyWeek,
  useUpdateMyWeek,
} from "../../Contexts/MyModulesContext";

import {
  Legend,
  EnterURL,
  Timetable,
  WeekSwitcher,
  CreatePersonalEvent,
} from "../../Components/Timetable";

import "../../Components/Timetable/timetable.css";

export function MyTimetable() {
  const myWeek = useMyWeek();
  const updateMyWeek = useUpdateMyWeek();
  const myModules = useMyModules();

  const legend = useMemo(() => <Legend />, [Legend]);
  const createPersonalEvent = useMemo(
    () => <CreatePersonalEvent timetableData={myModules} />,
    [myModules]
  );

  // lift week in WeekSwitcher
  const handleWeekChange = (event, value) => {
    // use event as first element, ordering requirement to extract value
    updateMyWeek(value);
  };

  const classes = makeStyles({
    paper: {
      marginTop: "-0.5em",
      backgroundColor: "#FFF",
    },
  })();

  return (
    <Paper className={classes.paper} square>
      {" "}
      <Timetable weekNumber={myWeek} timetableData={myModules}>
        <div className="header">
          <div id="legend">{legend}</div>
          <div id="week-switcher">
            <WeekSwitcher handleChange={handleWeekChange} week={myWeek} />
          </div>
          <div id="action-button">{createPersonalEvent}</div>
        </div>
      </Timetable>
      <div id="url-input">
        <EnterURL />
      </div>
    </Paper>
  );
}
