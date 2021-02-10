import { React, Fragment, useState } from "react";
import Body from "./Body";

import firebase from "firebase";
import firebaseConfig from "../Firebase/firebaseConfig";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  var database = firebaseApp.database();
} else {
  // If firebase is already initialized
  firebase.app();
  var database = firebase.app().database();
}

function UserProfile(props) {
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
        User Profile
      </div>
      
      <Body getUsers={getUsers} userList={userList} />
    </Fragment>
  );
}

export default UserProfile;
