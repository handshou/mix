import React from "react";

function pickColour(type) {
  let colors = ["#FDDFDF", "#F0DEFD", "#DEFDE0", "#DEF3FD", "#FCF7DE"];
  let setColor = "#FFFFFF";

  if (type.includes("Lecture")) {
    setColor = colors[0];
  } else if (type.includes("Tutorial")) {
    setColor = colors[1];
  } else if (type == "Private") {
    setColor = colors[2];
  } else {
    setColor = colors[3];
  }

  return setColor;
}

const TimetableModules = (props) => {
  const { data } = props;
  // create a new component for modules
  const modules = data.map((module, index) => {
    const { studentId = 0 , id, title, type } = module;

    function handleClick() {
      console.log("studentId", studentId);
      console.log("title", title);
    }

    return (
      <div key={`${id}-${index}`} style={{ backgroundColor: pickColour(type)}}>
        <button onClick={handleClick}>{title}</button>
        <div>{type}</div>
      </div>
    );
  });

  return <div style={{display: "flex", flexDirection: "column", height: "100%" }}>{modules}</div>;
};

export { TimetableModules };
