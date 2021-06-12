import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../Routes/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact={true} component={Home} />
        <Redirect from={"*"} to={"/"} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
