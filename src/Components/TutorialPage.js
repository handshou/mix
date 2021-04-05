import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import GroupIcon from "@material-ui/icons/Group";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuItem from "@material-ui/core/MenuItem";
import urlTutVid from "./tutorialGIFs/FullImportStep.mp4";
import groupTutVid from "./tutorialGIFs/CreateGroup.mp4";
import addingMember from "./tutorialGIFs/AddingMember.mp4";
import deleteGroup from "./tutorialGIFs/DeletingGroup.mp4";
import weeksNav from "./tutorialGIFs/ClickingWeeks.mp4";
import { MenuList } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export function TutorialPage() {
  const [activeStep, setActiveStep] = useState();
  const useStyles = makeStyles((theme) => ({
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
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
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
    sideNavBarActive: {
      borderBottom: "5px solid #ff5138 !important",
      backgroundColor: "#fbfbfb",
    },
    expandIconRoot: {
      boxShadow: "grey 5px 5px 5px 0px",
      borderRadius: "50%",
      transition: "all 0.3s ease 0s",
    "&:hover": {
      boxShadow: "0px 10px 15px #ff5942",
      transform: "translateY(-2px)",
    },
    }
  }));

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
          <div>
            <br></br>
            <b>Click</b> on any tabs from the left, to find what you need.
          </div>
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
            Hello <b>{localStorage.getItem("studentName")}</b>, your User ID is{" "}
            <b>{localStorage.getItem("studentId")}</b>. It is tied to your
            profile and you cannot change it. Other MixTime users can add you
            via this ID number.
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
              4. When you are done, click on the <SaveIcon />.
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
            weekend events, on top of your curricular events at NUS. Click on
            one of the tabs below to find out more.
          </p>
          <br></br>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={classes.expandIconRoot}/>}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                Importing Your Timetable
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Steps on how to <b>import</b> your timetables from NUSMods.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  You <b>must</b> import your NUSMods timetable into MixTime, to
                  see it on your <b>Timetable Page</b>.
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
                    2. You should see your own timetable. Click on the
                    "Share/Sync" button.
                  </li>
                  <li>3. Click on the Copy icon.</li>
                  <li>
                    4. Paste your link into MixTime, under the{" "}
                    <b>Enter NUSMods Sharing URL</b> textbox.
                  </li>
                  <li>
                    5. Head back to MixTime's website and navigate to the URL
                    textbox on the <b>My Timetable</b> page.
                  </li>
                  <li>
                    6. Place the copied NUSMods URL, and click on the{" "}
                    <b>Update Timetable</b> button.
                  </li>
                  <li>
                    7. Your timetable has been successfully added. You can see
                    it from the "My Timetable" tab.
                  </li>
                </ol>
                <br></br>
                <p>
                  See video steps <b>here</b>:
                </p>
                <video key={urlTutVid} controls muted style={{ width: "70%" }}>
                  <source src={urlTutVid} type="video/mp4" />
                </video>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Adding New Events
              </Typography>
              <Typography className={classes.secondaryHeading}>
                You can <b>add events</b> into your timetable.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  You can <b>add an event</b> into your MixTime timetables, on
                  top of your NUSMods timetable.
                </p>
                <br></br>
                <p>
                  To <b>add</b> new events, follow these steps:
                </p>
                <ol>
                  <li>
                    1. In the <b>My Timetable</b> page. On the right of your
                    screen, click on the <b>Create Event</b> button.
                  </li>
                  <li>
                    2. A prompt will appear. Enter the event details
                    accordingly.
                  </li>
                  <li>
                    3. When you are done, click on the <b>Submit</b> button.
                  </li>
                  <li>
                    4. Your name has been successfully changed. You should be
                    able to see the update now. If you can't, try to refresh
                    your browser.
                  </li>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Navigating The Weeks
              </Typography>
              <Typography className={classes.secondaryHeading}>
                You can go through different <b>weeks</b> to check your
                schedule.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  On MixTime, we follow the <b>same semestral periods</b> as
                  NUS. You can go through each week by clicking on the week
                  number.
                </p>
                <br></br>
                <p>
                  Each week should display your timetable schedules, based on
                  your imported timetable. If you cannot see it, refer to{" "}
                  <b>Importing Your Timetable</b> tab.
                </p>

                <br></br>
                <p>
                  Note that week 7 is also the recess week, hence there should
                  be no lessons appearing on that page. To get to each page,
                  simply click on the corresponding page number.
                </p>
                <video key={weeksNav} autoPlay loop muted style={{ width: "70%" }}>
                  <source src={weeksNav} type="video/mp4" />
                </video>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <br></br>
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
            or delete the group entirely. Click on one of the tabs below to find
            out more.
          </p>

          <br></br>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Creating A Group
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Steps on how to <b>create</b> groups.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
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
                    4. Enter number of group members (I.e., 5 members, this
                    includes you).
                  </li>
                  <li>
                    5. Enter each group member's ID. Their IDs are found at the
                    top right of their own screens.
                  </li>
                  <li>
                    6. When you are done, click <b>OK</b>. You should see a new
                    group appearing on the page. Wait for awhile or refresh if
                    you don't see any.
                  </li>
                </ol>
                <br></br>
                <p>
                  See video steps <b>here</b>:
                </p>
                <video
                  key={groupTutVid}
                  controls
                  muted
                  style={{ width: "70%" }}
                >
                  <source src={groupTutVid} type="video/mp4" />
                </video>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Adding Group Members
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Adding members to your MixTime group.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  You can <b>add</b> other MixTime users into the groups you
                  have formed.
                </p>
                <br></br>
                <p>
                  To <b>add other members</b>, follow these steps:
                </p>
                <ol>
                  <li>
                    1. Head over to the <b>Manage Groups</b> page.
                  </li>
                  <li>
                    2. Click on the <b>Add Member</b> button, in the group that
                    you wish to add your members.
                  </li>
                  <li>
                    3. A dialog will appear at the top of your screen. Enter
                    your member's <b>User ID</b>.
                  </li>
                  <li>
                    4. When you are done, click on <b>OK</b>. You should see
                    your member's name in the corresponding group card. Wait for
                    awhile or refresh if you don't see any.
                  </li>

                  <br></br>
                  <p>
                    See video steps <b>here</b>:
                  </p>
                  <video
                    key={addingMember}
                    controls
                    muted
                    style={{ width: "70%" }}
                  >
                    <source src={addingMember} type="video/mp4" />
                  </video>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Editing Your Group Name
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Rename your group based on your preferences.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  You can <b>only</b> change your group name on the{" "}
                  <b>Manage Groups page</b>.
                </p>
                <br></br>
                <p>
                  To <b>change your group name</b>, follow these steps:
                </p>
                <ol>
                  <li>
                    1. Head over to the <b>Manage Groups</b> page.
                  </li>
                  <li>
                    2. Click on the <CreateIcon /> icon.
                  </li>
                  <li>
                    3. Enter your <b>desired Group Name</b>.
                  </li>
                  <li>
                    4. When you are done, click on the <SaveIcon />. You should
                    see your new group name. Wait for awhile or refresh if you
                    don't see any.
                  </li>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Leaving Your Group
              </Typography>
              <Typography className={classes.secondaryHeading}>
                You can <b>leave a MixTime group</b> when you no longer need it.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  When you leave a MixTime group, <b>only</b> you will be{" "}
                  <b>removed</b> from the group. Everyone else inside the group
                  will still remain there.
                </p>
                <br></br>
                <p>
                  To <b>leave a group</b>, follow these steps:
                </p>
                <br></br>

                <ol>
                  <li>
                    1. Head over to the <b>Manage Groups</b> page.
                  </li>
                  <li>
                    2. Click on the <b> Leave Group </b> button.
                  </li>
                  <li>
                    3. A <b>prompt</b> will appear on the top of your screen.
                  </li>
                  <li>
                    4. Click on <b>OK</b> if you really want to leave group.
                  </li>
                  <li>
                    5. You will see a message on the top right of your screen.
                    This will tell you whether you have left the group or not.
                  </li>
                </ol>

                <br></br>
                <p>
                  If you have <b>left a group by accident</b>, simply tell your
                  group members to add you back in via your User ID (
                  {localStorage.getItem("studentId")}).
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Deleting A Group
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Deleting a MixTime group which you don't need.
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                <p>
                  When you delete a MixTime group, it is a permanent action. The
                  group will <b>no longer</b> be available to anyone after
                  deletion.
                </p>
                <br></br>
                <p>
                  You <b>must</b> remove everyone from the group first, before
                  being able to delete the group.
                </p>
                <br></br>
                <p>
                  To <b>delete a group</b>, follow these steps:
                </p>
                <br></br>

                <ol>
                  <li>
                    1. Head over to the <b>Manage Groups</b> page.
                  </li>
                  <li>
                    2. Click on the <DeleteIcon /> icon.
                  </li>
                  <li>
                    3. A <b>prompt</b> will appear on the top of your screen.
                  </li>
                  <li>
                    4. Click on <b>OK</b> if you really want to delete the
                    group.
                  </li>
                  <li>
                    5. You will see a message on the top right of your screen.
                    This will tell you whether the deletion is successful.
                  </li>
                  <br></br>
                  <p>
                    See video steps <b>here</b>:
                  </p>
                  <video
                    key={deleteGroup}
                    controls
                    muted
                    style={{ width: "70%" }}
                  >
                    <source src={deleteGroup} type="video/mp4" />
                  </video>
                </ol>
              </Typography>
            </AccordionDetails>
          </Accordion>
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
        Hello {localStorage.getItem("studentName")}. How can we help you?
      </p>
      <br></br>
      <div
        style={{
          display: "-webkit-inline-box",
          marginLeft: "13%",
        }}
      >
        <div>
        <MenuList
            style={{
              display: "contents",
              width: "10%",
              boxShadow: "0 3px 5px 2px rgb(0 0 0 / 15%)",
              color: "black",
            }}
          >
            <MenuItem
              selected={activeStep === 0 ? true : false}
              onClick={() => setActiveStep(0)}
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{  marginTop: "10px", marginBottom: "10px" }}
            >
              <AccountBoxIcon /> &nbsp;&nbsp; About Profiles
            </MenuItem>
            <Divider />

            <MenuItem
              selected={activeStep === 1 ? true : false}
              onClick={() => setActiveStep(1)}
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{  marginTop: "10px", marginBottom: "10px"}}
            >
              <CalendarTodayIcon /> &nbsp;&nbsp; About Timetables
            </MenuItem>
            <Divider />

            <MenuItem
              selected={activeStep === 2 ? true : false}
              onClick={() => setActiveStep(2)}
              classes={{
                root: classes.buttonDesign,
                selected: classes.sideNavBarActive,
              }}
              style={{  marginTop: "10px", marginBottom: "10px"}}
            >
              <GroupIcon /> &nbsp;&nbsp; About Groups
            </MenuItem>
            <Divider />

          </MenuList>
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
