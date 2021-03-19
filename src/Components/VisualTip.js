import { React, useState, useEffect } from "react";
import PNGtooltip from "react-png-tooltip";
import urlTut from "./tutorialGIFs/FullImportStep.mp4";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";

export function VisualTip() {
  return (
    <div>
      <PNGtooltip
      tooltip={<OndemandVideoIcon style={{
          color: "#ff7043",
          marginLeft: 15,
        }}>
        </OndemandVideoIcon>}
      >
        <video autoPlay loop muted style= {{maxWidth: "200%"}}>
          <source src={urlTut} type="video/mp4" />
        </video>
      </PNGtooltip>
    </div>
  );
}

export default VisualTip;
