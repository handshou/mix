import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import GroupIcon from "@material-ui/icons/Group";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";

import urlTutVid from "./tutorialGIFs/FullImportStep.mp4";
import groupTutVid from "./tutorialGIFs/CreateGroup.mp4";

export function TutorialPage() {
  const [activeStep, setActiveStep] = useState();
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

  const classes = useStyles();

  //Card Content
  function getCardContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return profileTut();
      case 1:
        return timetableTut();
      case 2:
        return groupTut();
      default:
        return (
          <div>Click on any tabs from the left, to find what you need.</div>
        );
    }
  }

  function profileTut() {
    return (
      <div>
        <p style={{ fontSize: "2em", paddingBottom: "10px" }}>Your Profile</p>

        <div
          style={{
            padding: "20px 30px 30px",
            backgroundColor: "#f2f2f2",
          }}
        >
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Profile Overview
          </p>

          <p>
            Your MixTime Profile provides you with visibility of your basic
            account information. Each account, is uniquely assigned an ID when
            you enter your name for the first time. The user ID for your profile
            is essential, as that is what your group members can add and
            recognise you via.
          </p>
          <br></br>
          <p>
            Depending on the groups you have joined, you can see each of the
            overlaying timetables from the <b>Group Timetable</b> tab.
          </p>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Your Account Details
          </p>

          <p>
            Your User ID is <b>{localStorage.getItem("studentId")}</b>. It is
            tied to your profile and you cannot change it. Other MixTime users
            can add you via this ID number.
          </p>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Changing Names
          </p>

          <p>You can change your name as you like on MixTime.</p>
          <br></br>
          <p>
            To <b>change</b> your name, follow these steps:
          </p>
          <ol>
            <li>
              1. On the top right of your screen, just beside your name, click
              on the <CreateIcon></CreateIcon> button.
            </li>
            <li>2. Your name will change into a textbox.</li>
            <li>3. Click on it, and change it to anything you need.</li>
            <li>
              4. When you are done, click on the <DoneIcon></DoneIcon>
            </li>
            <li>
              5. Your name has been successfully changed. You should be able to
              see the update now. If you can't, try to refresh your browser.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  function timetableTut() {
    return (
      <div>
        <p style={{ fontSize: "2em", paddingBottom: "10px" }}>
          Your MixTime Timetable
        </p>

        <div
          style={{
            padding: "20px 30px 30px",
            backgroundColor: "#f2f2f2",
          }}
        >
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Timetable Overview
          </p>

          <p>
            Your MixTime Timetable is a display of your imported NUSMods
            timetable. It allows you to add non-curricular events. These events
            will be kept anonymous to other group members, and they will not be
            able to see its description.
          </p>
          <br></br>
          <p>
            Depending on your schedule, the timetable will be able to display
            weekend events, on top of your curricular events at NUS.
          </p>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Importing Your Timetable
          </p>

          <p>
            You <b>must</b> import your NUSMods timetable into MixTime, to see
            it on your <b>Timetable Page</b>.
          </p>
          <br></br>
          <p>
            To <b>import your timetable</b>, follow these steps:
          </p>
          <ol>
            <li>
              1. Head over to{" "}
              <u>
                <a href="https://nusmods.com/">NUSMods</a>
              </u>{" "}
              website.
            </li>
            <li>
              2. You should see your own timetable. Click on the "Share/Sync"
              button.
            </li>
            <li>3. Click on the Copy icon.</li>
            <li>
              4. Paste your link into MixTime, under the{" "}
              <b>Enter NUSMods Sharing URL</b> textbox.
            </li>
            <li>
              5. Head back to MixTime's website and navigate to the URL textbox
              on the <b>My Timetable</b> page.
            </li>
            <li>
              6. Place the copied NUSMods URL, and click on the{" "}
              <b>Update Timetable</b> button.
            </li>
            <li>
              7. Your timetable has been successfully added. You can see it from
              the "My Timetable" tab.
            </li>
          </ol>
          <br></br>
          <p>
            See video steps <b>here</b>:
          </p>
          <video key={urlTutVid} autoPlay loop muted style={{ width: "70%" }}>
            <source src={urlTutVid} type="video/mp4" />
          </video>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Adding New Events
          </p>

          <p>
            You can <b>add events</b> into your timetable.
          </p>
          <br></br>
          <p>
            To <b>add</b> new events, follow these steps:
          </p>
          <ol>
            <li>
              1. In the <b>My Timetable</b> page, on the right of your screen,
              click on the <b>Create Event</b> button.
            </li>
            <li>
              2. A prompt will appear. Enter the event details accordingly.
            </li>
            <li>
              3. When you are done, click on the <b>Submit</b> button.
            </li>
            <li>
              4. Your name has been successfully changed. You should be able to
              see the update now. If you can't, try to refresh your browser.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  function groupTut() {
    return (
      <div>
        <p style={{ fontSize: "2em", paddingBottom: "10px" }}>
          Your MixTime Groups
        </p>

        <div
          style={{
            padding: "20px 30px 30px",
            backgroundColor: "#f2f2f2",
          }}
        >
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Manage Groups Overview
          </p>

          <p>
            In MixTime, you are able to form groups. These groups will allow you
            to see what are some timeslots that your group members are
            unavailable. You can plan for meetings based on the free timeslots.
          </p>
          <br></br>
          <p>
            Additionally, you can manage your groups, remove members, add them,
            or delete the group entirely.
          </p>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Creating A Group
          </p>

          <p>
            You <b>must</b> crete groups first, then add members in, before
            being able to see everyone's timetables on the{" "}
            <b>Group Timetaable</b> Page.
          </p>
          <br></br>
          <p>
            To <b>create a group</b>, follow these steps:
          </p>
          <ol>
            <li>
              1. Head over to the <b>Manage Groups</b> page.
            </li>
            <li>2. Click on the big (+) icon.</li>
            <li>
              3. Enter your <b>Group Name</b>.
            </li>
            <li>
              4. Enter number of group members (I.e., 5 members, this includes
              you).
            </li>
            <li>
              5. Enter each group member's ID. Their IDs are found at the top
              right of their own screens.
            </li>
            <li>
              6. When you are done, click <b>OK</b>. You should see a new group
              appearing on the page. Wait for awhile or refresh if you don't see
              any.
            </li>
          </ol>
          <br></br>
          <p>
            See video steps <b>here</b>:
          </p>
          <video key={groupTutVid} autoPlay loop muted style={{ width: "70%" }}>
            <source src={groupTutVid} type="video/mp4" />
          </video>

          <br></br>
          <p style={{ fontSize: "1.5em", paddingBottom: "10px" }}>
            Editing Your Group Details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontWeight: "600",
          fontSize: "2em",
          fontFamily: "Lato, sans-serif",
        }}
      >
        Hello. How can we help you?
      </p>

      <div
        style={{
          display: "-webkit-inline-box",
          marginLeft: "13%",
        }}
      >
        <div>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem button onClick={() => setActiveStep(0)}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="About Profiles" />
            </ListItem>

            <Divider />
            <ListItem button onClick={() => setActiveStep(1)}>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="About Timetables" />
            </ListItem>

            <Divider />
            <ListItem button onClick={() => setActiveStep(2)}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="About Groups" />
            </ListItem>
          </List>
        </div>

        <div style={{ clear: "both" }} />

        <div
          style={{
            width: "80%",
            paddingLeft: "20px",
          }}
        >
          <Typography>{getCardContent(activeStep)}</Typography>
        </div>
      </div>
    </div>
  );
}

export default TutorialPage;
