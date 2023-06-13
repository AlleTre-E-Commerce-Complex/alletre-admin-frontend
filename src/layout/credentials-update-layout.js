import React from "react";
import { Route, Switch } from "react-router-dom";
import ResetPasswordPage from "../page/auth/rest-password-page";
import routes from "../routes";

const CredentialsuUpdateLayout = () => {
  return (
    <div className="">
      <Switch>
        <Route
          path={routes.auth.forgetpass.restpass}
          component={ResetPasswordPage}
        />
      </Switch>
    </div>
  );
};

export default CredentialsuUpdateLayout;
