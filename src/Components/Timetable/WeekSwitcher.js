import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles(() => ({
  ul: {
    "& .MuiPaginationItem-root": {
      boxShadow: "0px 2px 2px 0px grey",
    },
  },
}));

const WeekSwitcher = (props) => {
  // 14 weeks is the default NUS semester length, including recess
  const { handleChange, week, maximumWeek = 14 } = props;
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0.5em",
      }}
    >
      <div>Semester 2 - Week {week}</div>
      {/* Week */}
      <Pagination
        classes={{ ul: classes.ul }}
        count={maximumWeek}
        page={week}
        siblingCount={0}
        onChange={handleChange}
        variant="outlined"
        // shape="rounded"
        boundaryCount={2}
      >
        Week
      </Pagination>
    </div>
  );
};

export default WeekSwitcher;
