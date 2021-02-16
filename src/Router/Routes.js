import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MyTimetable from "../Components/MyTimetable";
import GroupTimetable from "../Components/GroupTimetable";
import UserProfile from "../Components/UserProfile";

import Layout from "../Components/Layout";

export default () => {
  return (
    <Router>
      <Layout></Layout>
      
      <Switch>
        <Route path="/" exact component={MyTimetable} />
        <Route path="/MyTimetable" exact component={MyTimetable} />
        <Route path="/GroupTimetable" exact component={GroupTimetable} />
        <Route path="/UserProfile" exact component={UserProfile} />
      </Switch>
    </Router>
  );
};
