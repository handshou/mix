import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";

import "./timetable.css";

const Legend = () => {
  return (
    <div>
      <div className="center">
        Colour Legend
        <Tooltip
          title={
            <div>
              <em style={{ fontSize: "12px" }}>{"What is this?"}</em>
              <p></p>
              <em style={{ fontSize: "12px" }}>
                {
                  "Each timeblock in your personal timetable will have their respective colour representation depending on the type of event."
                }
              </em>
            </div>
          }
        >
          <IconButton aria-label="delete">
            <HelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <table style={{ display: "flex" }}>
        <tbody>
          <tr>
            <th style={{ background: "#FDDFDF", color: "#000000" }}>Lecture</th>
            <th style={{ background: "#F0DEFD", color: "#000000" }}>
              Tutorial
            </th>
            <th style={{ background: "#DEFDE0", color: "#000000" }}>Private</th>
            <th style={{ background: "#DEF3FD", color: "#000000" }}>Others</th>
            <th
              style={{
                background: "#FFFFFF",
                color: "#000000",
                border: "1px solid lightgrey",
              }}
            >
              Available
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Legend;
