import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";
import AuthTabe from "../page/auth/auth-tabe";

const AuthLayouts = () => {
  return (
    <div className="h-screen">
      <Switch>
        cdjhbdsjhbcdj
        <Route path={routes.auth.default} component={AuthTabe} />
      </Switch>
    </div>
  );
};

export default AuthLayouts;
