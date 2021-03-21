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
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";
import DirectionsIcon from '@material-ui/icons/Directions';

import "./Stylesheet/Layout.css";
import { makeStyles } from "@material-ui/core/styles";

import { useHistory, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const useStyles = makeStyles({
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
    padding: "10px 10px",
    backgroundColor: "#fbfbfb",
    border: "none",
    borderRadius: "45px",
    transition: "all 0.3s ease 0s",
    cursor: "pointer",
    outline: "none",
    "&:hover": {
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
    setStudentId(localStorage.getItem("studentId"));
    setStudentName(localStorage.getItem("studentName"));
  }, [props.forceRefresh]);

  function editStudentName(event) {
    localStorage.setItem("studentName", event.target.value);
    setStudentName(localStorage.getItem("studentName"));
    setStudentNameTextbox({ disable: false, val: studentName });
  }

  const [studentNameTextbox, setStudentNameTextbox] = useState({
    disable: true,
    val: "",
    readOnly: true,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey(0);
    setStudentName(localStorage.getItem("studentName"));
  }, [refreshKey]);

  function enableStudentNameEdit() {
    setStudentNameTextbox({
      disable: false,
      val: studentName,
      readOnly: false,
    });
    setRefreshKey(refreshKey + 1);
  }

  function updateStudentName() {
    setStudentNameTextbox({ disable: true, val: studentName, readOnly: true });

    if (studentNameTextbox.val !== localStorage.getItem("studentName")) {
      toast.success("Student name has been updated successfully.");
    }

    //To update in firebase for real logic [now is just update in client side]
  }

  return (
    <Fragment>
      <AppBar position="static" className={classes.topNavBar}>
        <Toolbar>
          <div style={{ width: "100%" }}>
            <Typography variant="h1" color="inherit">
              <div style={{ color: "#ff5138" }}>
                <div style={{ float: "right", marginTop: "2%" }}>
                  <Typography variant="h5">
                    <Tooltip
                      title={
                        <em>
                          {
                            "This is your Student Name. The number is your User ID."
                          }
                        </em>
                      }
                    >
                      <IconButton aria-label="delete">
                        <HelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    Hi,{" "}
                    {localStorage.getItem("studentName") !== null &&
                    studentNameTextbox.val.length !== 0 ? (
                      <input
                        className="renameText"
                        type="text"
                        disabled={studentNameTextbox.disable}
                        value={studentName}
                        onChange={editStudentName}
                        readOnly={studentNameTextbox.readOnly}
                        size={studentNameTextbox.val.length - 3}
                        style={
                          studentNameTextbox.readOnly === false
                            ? {
                                padding: "4px 4px 4px 4px",
                                borderRadius: "4px",
                                outline: "none",
                                border: "1px solid #da337a",
                                boxShadow: "0px 0px 8px #da337a",
                              }
                            : {}
                        }
                      ></input>
                    ) : (
                      <span>{studentName}</span>
                    )}
                    (#{studentId})
                    {
                      studentNameTextbox.readOnly === true ? (
                        //   <Button
                        //   variant="contained"
                        //   color="primary"
                        //   style={{ width: "fit-content" }}
                        // >
                        <Link
                          onClick={() => {
                            enableStudentNameEdit();
                          }}
                        >
                          <span style={{ color: "black" }}>
                            {/* <abbr title="Edit Student Name"><CreateIcon/></abbr> */}
                            <CreateIcon />
                          </span>
                        </Link>
                      ) : (
                        // </Button>
                        //   <Button
                        //   variant="contained"
                        //   color="primary"
                        //   style={{ width: "fit-content" }}
                        // >
                        <Link
                          onClick={() => {
                            updateStudentName();
                          }}
                        >
                          <span style={{ color: "black" }}>
                            {/* <abbr title="Save Changes"><DoneIcon /></abbr> */}
                            <DoneIcon />
                          </span>
                        </Link>
                      )
                      // </Button>
                    }
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
              // float: "left",
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
            &nbsp;&nbsp; 
            <span style={{ float: "right", display: "inherit" }}>
              <MenuItem
                classes={{
                  root: classes.buttonDesign,
                  selected: classes.sideNavBarActive,
                }}
                style={{ width: "fit-content", marginLeft: "auto" }}
                component={Link}
                to="/TutorialPage"
                itemID="/TutorialPage"
                selected={location.pathname === "/TutorialPage" ? true : false}
              >
                <div
                  style={{
                    color: "black",
                  }}
                >
                  <DirectionsIcon/> &nbsp;&nbsp; Learning Guide
                </div>
              </MenuItem>
            </span>
          </MenuList>
        </div>
      </AppBar>
    </Fragment>
  );
}

export default Layout;
