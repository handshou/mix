import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "../Components/HomePage";
import Timetable from "../Components/Timetable";
import UserProfile from "../Components/UserProfile";

import Layout from "../Components/Layout";

export default () => {
  return (
    <Router>
      <Layout></Layout>
      
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/Timetable" exact component={Timetable} />
        <Route path="/UserProfile" exact component={UserProfile} />
      </Switch>
    </Router>
  );
};
