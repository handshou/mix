import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GroupManagement from "../Components/GroupManagement";
import GroupTimetable from "../Components/GroupTimetable";
import UserProfile from "../Components/UserProfile";
import MyTimetable from "../Components/Timetable/MyTimetable";

import Layout from "../Components/Layout";

export default () => {
  return (
    <Router>
      <Layout></Layout>
      
      <Switch>
        <Route path="/" exact component={MyTimetable} />
        <Route path="/GroupManagement" exact component={GroupManagement} />
        <Route path="/GroupTimetable" exact component={GroupTimetable} />
        <Route path="/UserProfile" exact component={UserProfile} />
        <Route path="/Timetable" exact component={MyTimetable} />
      </Switch>
    </Router>
  );
};
