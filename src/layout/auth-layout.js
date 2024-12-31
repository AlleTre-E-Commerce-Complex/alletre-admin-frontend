import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";
import AuthTabe from "../page/auth/auth-tabe";

const AuthLayouts = () => {
  console.log('auth layout')
  return (
    <div className="h-screen">
      <Switch>
        <Route path={routes.auth.default} component={AuthTabe} />
      </Switch>
    </div>
  );
};

export default AuthLayouts;
