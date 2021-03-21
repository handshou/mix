import React from "react";

import Pagination from "@material-ui/lab/Pagination";

const WeekSwitcher = (props) => {
  const { handleChange, week } = props;
  return (
    <div style={{ padding: "0px 0px 0px 0px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
        }}
      >
        Week
      </div>
      <Pagination
        count={13}
        page={week}
        siblingCount={0}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        boundaryCount={2}
      />
    </div>
  );
};

export default WeekSwitcher;
