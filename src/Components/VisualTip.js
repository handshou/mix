import { React, useState, useEffect } from "react";
import PNGtooltip from "react-png-tooltip";
import urlTut from "./tutorialGIFs/FullImportStep.mp4";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";

export function VisualTip() {
  return (
    <div>
      <PNGtooltip
        tooltip={
          <OndemandVideoIcon
            style={{
              color: "#ff7043",
              marginLeft: 15,
            }}
          ></OndemandVideoIcon>
        }
      >
        <div style={{ width: "150%" }}>
          <p>
            You <b>must</b> import your NUSMods timetable into MixTime, to see
            it on your Timetable Page. Follow the video here to import your
            timetable:
          </p>
          <br></br>

          <video autoPlay loop muted style={{ maxWidth: "100%" }}>
            <source src={urlTut} type="video/mp4" />
          </video>
        </div>
      </PNGtooltip>
    </div>
  );
}

export default VisualTip;
