import { React, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import HomeIcon from "@material-ui/icons/Home";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PersonIcon from "@material-ui/icons/Person";

import "./Stylesheet/Layout.css";
import { makeStyles } from "@material-ui/core/styles";

import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles({
  buttons: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
  topNavBar: {
    background: "white",
    backgroundColor: "#fbfbfb",
  },
  sideNavBar: {
    padding: "10px 10px",
    backgroundColor: "#fbfbfb",
  },
  sideNavBarActive: {
    borderLeft: "3px solid #ff5138",
    backgroundColor: "#fbfbfb",
  },
});

function Layout(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <Fragment>
      <AppBar position="static" className={classes.topNavBar}>
        <Toolbar>
          <div style={{ float: "left", width: "100%" }}>
            <Typography variant="title" color="inherit">
              <div style={{ color: "#ff5138" }}>
                <Typography variant="h3" component="h4">
                  MixTime
                </Typography>
                <Typography variant="body1">
                  <i>We mix your time to get the best mix of time available.</i>
                </Typography>
              </div>
            </Typography>
          </div>
          <div style={{ float: "right" }}>
            <Button className={classes.buttons}>Login</Button>
          </div>
        </Toolbar>
      </AppBar>

      <MenuList
        style={{
          display: "inline-table",
          width: "10%",
          boxShadow: "0 3px 5px 2px rgb(0 0 0 / 15%)",
          height: "calc(100vh - 3.75rem - 1px)",
          float: "left",
        }}
        activeItemId={location.pathname}
        activeClassName={classes.sideNavBarActive}
        onSelect={({ itemId }) => {
          history.push(itemId);
        }}
      >
        <MenuItem
          component={Link}
          to="/"
          itemId="/"
          selected={location.pathname === "/" ? true : false}
          classes={{
            root: classes.sideNavBar,
            selected: classes.sideNavBarActive,
          }}
        >
          <HomeIcon /> &nbsp;&nbsp;
          Home
        </MenuItem>
        <MenuItem
          component={Link}
          to="/Timetable"
          itemId="/Timetable"
          selected={location.pathname === "/Timetable" ? true : false}
          classes={{
            root: classes.sideNavBar,
            selected: classes.sideNavBarActive,
          }}
        >
          <CalendarTodayIcon /> &nbsp;&nbsp;
          Timetable
        </MenuItem>
        <MenuItem
          component={Link}
          to="/UserProfile"
          itemId="/UserProfile"
          selected={location.pathname === "/UserProfile" ? true : false}
          classes={{
            root: classes.sideNavBar,
            selected: classes.sideNavBarActive,
          }}
        >
          <PersonIcon /> &nbsp;&nbsp;
          User Profile
        </MenuItem>
      </MenuList>
    </Fragment>
  );
}

// export default makeStyles(makeStyles)(Layout);
export default Layout;
