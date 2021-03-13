import { React, Fragment, useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

import { Link } from "react-router-dom";

import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import GroupIcon from "@material-ui/icons/Group";
import ScheduleIcon from "@material-ui/icons/Schedule";

import "./Stylesheet/Layout.css";
import { makeStyles } from "@material-ui/core/styles";

import { useHistory, useLocation } from "react-router-dom";



const useStyles = makeStyles({
  // buttons: {
  //   background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  //   border: 0,
  //   borderRadius: 3,
  //   boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  //   color: "white",
  //   height: 48,
  //   padding: "0 30px",
  // },
  topNavBar: {
    background: "white",
    backgroundColor: "#fbfbfb",
  },
  sideNavBar: {
    padding: "10px 10px",
    backgroundColor: "#fbfbfb",
    borderRadius: "45px",
  },
  sideNavBarActive: {
    borderTop: "5px solid #ff5138 !important",
    backgroundColor: "#fbfbfb",
  },
  buttonDesign: {    
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    color: "#000",
    // backgroundColor: "#fff",
    padding: "10px 10px",
    backgroundColor: "#fbfbfb",
    border: "none",
    borderRadius: "45px",
    transition: "all 0.3s ease 0s",
    cursor: "pointer",
    outline: "none",
    "&:hover":{
      // backgroundColor: "#2EE59D",
      boxShadow: "0px 10px 15px #ff5138",
      transform: "translateY(-7px)",
    },
  },
});

function Layout(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName")
  );

  useEffect(() => {
    console.log("layout is refreshing");
    setStudentId(localStorage.getItem("studentId"));
    setStudentName(localStorage.getItem("studentName"));
    console.log(studentId);
    console.log(studentName);
  }, [props.forceRefresh]);

  return (
    <Fragment>
      <AppBar position="static" className={classes.topNavBar}>
        <Toolbar>
          <div style={{ width: "100%" }}>
            <Typography variant="h1" color="inherit">
              <div style={{ color: "#ff5138" }}>
                <div style={{ float: "right", marginTop: "2%" }}>
                  <Typography variant="h5">
                    Hi,{" "}
                    <b>
                      {studentName} (#{studentId})
                    </b>
                  </Typography>
                </div>
                <Typography variant="h3" component="h4">
                  MixTime
                </Typography>
                <Typography variant="body1">
                  <i>We mix your time to get the best mix of time available.</i>
                </Typography>
              </div>
            </Typography>
            <br></br>
          </div>
        </Toolbar>
        <div
          style={{      
            display: "inherit",
            padding: "1%",
            // margin: "auto",
            textAlign: "center",
            // width: "100%",
          }}
        >
          <MenuList
            style={{
              display: "contents",
              width: "10%",
              boxShadow: "0 3px 5px 2px rgb(0 0 0 / 15%)",
              height: "100vh",
              float: "left",
              color: "black",
            }}
            onSelect={({ itemID }) => {
              history.push(itemID);
            }}
          >
            <MenuItem
              component={Link}
              to="/Timetable"
              itemID="/Timetable"
              selected={
                location.pathname === "/Timetable" || location.pathname === "/"
                  ? true
                  : false
              }
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{ width: "fit-content" }}
            >
              <CalendarTodayIcon /> &nbsp;&nbsp; My Timetable
            </MenuItem>
            &nbsp; &nbsp;
            <MenuItem
              component={Link}
              to="/GroupTimetable"
              itemID="/GroupTimetable"
              selected={location.pathname === "/GroupTimetable" ? true : false}
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{ width: "fit-content" }}
            >
              <ScheduleIcon /> &nbsp;&nbsp; Group Timetable
            </MenuItem>
            &nbsp; &nbsp;
            {/* <MenuItem
          component={Link}
          to="/UserProfile"
          itemID="/UserProfile"
          selected={location.pathname === '/UserProfile' ? true : false}
          classes={{
            root: classes.sideNavBar,
            selected: classes.sideNavBarActive,
          }}>
          <HomeIcon /> &nbsp;&nbsp; UserProfile [TEST]
        </MenuItem> */}
            <MenuItem
              component={Link}
              to="/GroupManagement"
              itemID="/GroupManagement"
              selected={location.pathname === "/GroupManagement" ? true : false}
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{ width: "fit-content" }}
            >
              <GroupIcon /> &nbsp;&nbsp; Manage Groups
            </MenuItem>
          </MenuList>
        </div>
      </AppBar>

      
    </Fragment>
  );
}

// export default makeStyles(makeStyles)(Layout);
export default Layout;