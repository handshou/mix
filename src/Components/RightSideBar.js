import { React, useState, useEffect } from "react";

function RightSideBar(props) {
  let toggleHideSideBar = () => {
    console.log("Missing hide sidebar props");
  };
  if (props.toggleHideSideBar !== undefined) {
    toggleHideSideBar = props.toggleHideSideBar;
  }

  // safety check of props cause not typescript
  if (props.isRightSideBarHidden !== undefined) {
    return (
      <div
        style={{
          marginTop: 30,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minWidth: props.isRightSideBarHidden ? 75 : 150,
        }}
      >
        <button
          onClick={() => {
            console.log("hi");
            toggleHideSideBar();
          }}
        >
          {props.isRightSideBarHidden ? "Show" : "Collapse"}
        </button>

        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
        <div>Item 5</div>
      </div>
    );
  } else {
    return <div> Missing Props</div>;
  }
}

export default RightSideBar;
