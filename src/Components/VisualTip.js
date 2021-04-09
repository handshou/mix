import { React, useState, useEffect } from "react";
import PNGtooltip from "react-png-tooltip";
import urlTut from "./tutorialGIFs/FullImportStep.mp4";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import IconButton from "@material-ui/core/IconButton";
import "./Stylesheet/Layout.css";

export function VisualTip() {
  return (
    <div>
      <PNGtooltip
        tooltip={
          <IconButton class="confirm_selection"><u>What can I do here?</u></IconButton>
        }
      >
        <div>
          <p>
            Follow this video to import your timetable. If you need more
            help, visit our{" "}
            <a href="./TutorialPage">
              <u>tutorial page</u>
            </a>
            .
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
