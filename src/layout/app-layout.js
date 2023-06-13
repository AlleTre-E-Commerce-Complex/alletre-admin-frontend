import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

const AppLayouts = () => {
  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      {/* <Header SetSid={SetSid} sid={sid} /> */}
      {/* <Sidebar SetSid={SetSid} sid={sid} /> */}
      <div className="p-0 m-0 border-none min-h-screen ">
        <Switch>
          {/* <Route path={routes.app.support} component={Support} /> */}
        </Switch>
      </div>
    </div>
  );
};

export default AppLayouts;
