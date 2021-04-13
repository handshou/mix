import { React, useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase";

import MyModulesContext from "../Contexts/MyModulesContext";
import MyGroupsContext from "../Contexts/MyGroupsContext";
import GroupModulesContext from "../Contexts/GroupModulesContext";
import GroupManagement from "../Components/GroupManagement";
import UserProfile from "../Components/UserProfile";
import GroupTimetable from "../Pages/GroupTimetable";
import MyTimetable from "../Pages/MyTimetable";

import Layout from "../Components/Layout";
import JoinGroup from "../Components/JoinGroup";

import TutorialPage from "../Components/TutorialPage";

import ViewArchivedGroups from "../Components/ViewArchivedGroups";

export default () => {
  const [forceRefresh, setForceRefresh] = useState(0);
  useEffect(() => {
    console.log("forceRefresh", forceRefresh);
  }, [forceRefresh]);

  let triggerLayoutForceRefresh = () => {
    setForceRefresh((forceRefresh) => forceRefresh + 1);
  };

  firebase.database();

  return (
    <Router>
      <div style={{ height: "100vh" }}>
        <Layout forceRefresh={forceRefresh} />
        <MyGroupsContext>
          <GroupModulesContext>
            <MyModulesContext>
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
                <Route
                  path="/GroupTimetable"
                  exact
                  component={GroupTimetable}
                />
                <Route path="/UserProfile" exact component={UserProfile} />
                <Route path="/Timetable" exact component={MyTimetable} />
                <Route path="/JoinGroup">
                  <JoinGroup
                    triggerLayoutForceRefresh={() => {
                      triggerLayoutForceRefresh();
                    }}
                  />
                </Route>
                <Route path="/TutorialPage" exact component={TutorialPage} />
                <Route
                  path="/ViewArchivedGroups"
                  exact
                  component={ViewArchivedGroups}
                />
              </Switch>
            </MyModulesContext>
          </GroupModulesContext>
        </MyGroupsContext>
      </div>
    </Router>
  );
};
