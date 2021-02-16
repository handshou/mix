import { React, useState, useEffect } from "react";
import { convertURLtoArray } from "../Functions/urlFunctions.js";
import { getModDetails } from "../Functions/apiFunctions.js";
import { Button, Input } from "@material-ui/core";

function Body(props) {

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
      <div
        style={{
          marginTop: 50,
        }}
      >
        <Button
          variant="contained"
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
