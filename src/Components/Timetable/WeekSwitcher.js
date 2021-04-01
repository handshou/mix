import React from "react";

import Pagination from "@material-ui/lab/Pagination";

const WeekSwitcher = (props) => {
  const { handleChange, week } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection:    "column",
        padding:"0.5em"
      }}
    >
      <div>Semester 2 - Week {week}</div>
      {/* Week */}
      <Pagination
        count={14}
        page={week}
        siblingCount={0}
        onChange={handleChange}
        variant="outlined"
        // shape="rounded"
        boundaryCount={2}
      >Week</Pagination>
    </div>
  );
};

export default WeekSwitcher;
