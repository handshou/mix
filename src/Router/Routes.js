import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GroupManagement from "../Components/GroupManagement";
import GroupTimetable from "../Components/GroupTimetable";
import UserProfile from "../Components/UserProfile";
import MyTimetable from "../Pages/MyTimetable";

import Layout from "../Components/Layout";
import JoinGroup from "../Components/JoinGroup";

import TutorialPage from "../Components/TutorialPage"

export default () => {
  const [forceRefresh, setForceRefresh] = useState(0);
  useEffect(() => {
    console.log("forceRefresh");
    console.log(forceRefresh);
  }, [forceRefresh]);

  let triggerLayoutForceRefresh = () => {
    setForceRefresh(forceRefresh + 1);
  };

  return (
    <Router>
      <Layout forceRefresh={forceRefresh} />

      <Switch>
        <Route path="/" exact>
          <MyTimetable
            triggerLayoutForceRefresh={() => {
              triggerLayoutForceRefresh();
            }}
          />
        </Route>
        <Route path="/GroupManagement" exact>
          <GroupManagement />
        </Route>
        <Route path="/GroupTimetable" exact component={GroupTimetable} />
        <Route path="/UserProfile" exact component={UserProfile} />
        <Route path="/Timetable" exact>
          <MyTimetable
            triggerLayoutForceRefresh={() => {
              triggerLayoutForceRefresh();
            }}
          />
        </Route>
        <Route path="/JoinGroup">
          <JoinGroup
            triggerLayoutForceRefresh={() => {
              triggerLayoutForceRefresh();
            }}
          />
        </Route>
        <Route path="/TutorialPage" exact component={TutorialPage}/>
      </Switch>
    </Router>
  );
};
