import React from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth";
import Home from "./home";
import LogIn from "./log-in";
import Nav from "./nav";
import NotFound from "./not-found";
import PublicNotes from "./public-notes";
import SignUp from "./sign-up";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/notes/:username" component={PublicNotes} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/log-in" component={LogIn} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
