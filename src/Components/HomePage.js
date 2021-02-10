import { React, Fragment, useState } from "react";

import Body from "./Body";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

import {CommonCss} from "./Stylesheet/Common.css";
import {Button} from "@material-ui/core";

//Copy line 9 to 15 when we need this "connectionString" to reach our firebase
if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

function HomePage(props) {
  const [userList, setUserList] = useState({});

  let getUsers = () => {
    var usersRef = database.ref("users/");
    usersRef.once("value").then((snapshot) => {
      snapshot.val() ? setUserList(snapshot.val()) : console.log("missing");
    });
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          wigth: "100%",
          padding: "2%",
        }}
      >
        Home Page

        <iframe height="500px" src="https://nusmods.com/timetable/sem-2/share?CS2105=TUT:05,LEC:1&GEH1049=LEC:3&IS4243=LEC:1&IS4261=LEC:1&ST2334=LEC:1,TUT:14"></iframe>
      
      <Button variant="contained" className={CommonCss} style={{"width":"fit-content"}}>Default</Button>
      <Button variant="contained" className={CommonCss} color="primary" style={{"width":"fit-content"}}>Primary</Button>
      <Button variant="contained" className={CommonCss} color="secondary" style={{"width":"fit-content"}}>Secondary</Button>
      <Button variant="contained" className={CommonCss} style={{"width":"fit-content"}} disabled>Disabled</Button>


      </div>


      <Body getUsers={getUsers} userList={userList} />
    </Fragment>
  );
}

export default HomePage;
