import { React, useState, useEffect } from "react";
import { convertURLtoArray } from "../Functions/urlFunctions.js";
import { getModDetails } from "../Functions/apiFunctions.js";
import CommonCss from "./Stylesheet/Common.css";
import { Button, Input } from "@material-ui/core";

function Body(props) {
  const [enteredURL, setEnteredURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Array which contains array of classes and slots occupied for the module
  // 00: (2) ["ACC3619", "SEC:A3"]
  // 01: (3) ["GES1041", "TUT:D6", "LEC:1"]
  // 02: (3) ["IS4100", "TUT:2", "LEC:1"]
  // 03: (3) ["IS4234", "TUT:2", "LEC:1"]
  // 04: (2) ["IS4261", "LEC:1"]
  const [modAndClassArray, setModAndClassArray] = useState([]);
  // Array which contains resolved promises with either details of the module in .value or error message in .reason
  const [modAndClassDetails, setModAndClassDetails] = useState([]);

  // checker to see if api is set, can be removed later on
  useEffect(() => {
    console.log(modAndClassDetails);
  }, [modAndClassDetails]);

  // waits for response and sets
  const getModuleDetails = async () => {
    let apiPromises = modAndClassArray.map((modAndClasses) => {
      // only need module code for api to ping details
      // safeguard for button
      if (
        modAndClasses &&
        modAndClasses.length > 0 &&
        modAndClasses[0].length > 0
      ) {
        return getModDetails(modAndClasses[0]);
      } else {
        console.log("no timetable loaded");
      }
    });
    // .allSettled() used instead of .all()
    // allowed failed requests to go through but prevents immediate failure
    // additional implmentation to catch errors is required
    Promise.allSettled(apiPromises).then((details) => {
      setModAndClassDetails(details);
    });
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        wigth: "100%",
      }}
    >
      <div>entered URL : {enteredURL}</div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        Enter URL:
        <div style={{ color: "red" }}>{errorMessage}</div>
        <Input
          className={CommonCss}
          style={{ width: 300 }}
          value={enteredURL}
          onChange={(e) => {
            setEnteredURL(e.target.value);
            setErrorMessage("");
          }}
        ></Input>
        <Button
          variant="contained"
          className={CommonCss}
          onClick={() => {
            // catches invalid URLs
            try {
              setModAndClassArray(convertURLtoArray(enteredURL));
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          parse timetable
        </Button>
        <Button
          variant="contained"
          className={CommonCss}
          onClick={() => {
            // catches api catastrophic api errors, though it should never be triggered as there promise.allSettled helps handle Errors
            try {
              getModuleDetails();
            } catch (error) {
              setErrorMessage(error);
            }
          }}
        >
          Ping timetable
        </Button>
      </div>
      <div
        style={{
          marginTop: 50,
        }}
      >
        <Button
          variant="contained"
          className={CommonCss}
          onClick={() => {
            if (props.getUsers !== undefined) {
              props.getUsers();
            } else console.log("lmao it didnt work");
          }}
        >
          Get user information from firebase
        </Button>
      </div>
      <div>
        {props.userList && props.userList.length > 0 ? (
          props.userList.map((val) => {
            return <div>{JSON.stringify(val)}</div>;
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Body;
