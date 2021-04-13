import { React, useMemo } from "react";

import TimetableModule from "./TimetableModule";

const TimetableCell = (props) => {
  const { data } = props;

  // create a new component for modules
  const modules = data.map((module, index) => (
    <TimetableModule
      key={`${module.id}-${index}`}
      moduleInfo={module}
      index={index}
    />
  ));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {modules}
    </div>
  );
};

export { TimetableCell };
