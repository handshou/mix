import { React, useState, useEffect } from "react";
import firebase from "firebase";
import firebaseConfig from "./Firebase/firebaseConfig";
import "./App.css";
import Header from "./Components/Header";
import Body from "./Components/Body";
import RightSideBar from "./Components/RightSideBar";

const firebaseApp = firebase.initializeApp(firebaseConfig);
var database = firebaseApp.database();

function App() {
  const [isRightSideBarHidden, setIsRightSideBarHidden] = useState(true);
  const [userList, setUserList] = useState({});

  const toggleHideSideBar = () => {
    setIsRightSideBarHidden(!isRightSideBarHidden);
  };

  let getUsers = () => {
    var usersRef = database.ref("users/");
    usersRef.once("value").then((snapshot) => {
      snapshot.val() ? setUserList(snapshot.val()) : console.log("missing");
    });
  };

  return (
    <div
      style={{        
        backgroundColor: "#282c34",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontSize: 18,
        color: "white",
      }}
    >
      <div
        style={{
          minHeight: 50,
          maxHeight: 50,
          width: "100%",
          borderBottom: "2px solid black",
        }}
      >
        <Header />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <div
          style={{
            borderRight: "2px solid black",
          }}
        >
          <RightSideBar
            isRightSideBarHidden={isRightSideBarHidden}
            toggleHideSideBar={toggleHideSideBar}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Body getUsers={getUsers} userList={userList}/>
        </div>
      </div>
    </div>
  );
}

export default App;
