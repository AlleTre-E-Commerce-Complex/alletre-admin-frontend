import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/side-bare/side-bare";
import Header from "../components/shared/header/header";
import routes from "../routes";
import Users from "../page/app/users/users";
import AuctionsTabs from "../page/app/auctions/auctions-tabs";

const AppLayouts = () => {
  const [sid, SetSid] = useState(false);
  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <Header SetSid={SetSid} sid={sid} />
      <Sidebar SetSid={SetSid} sid={sid} />
      <div className="p-0 m-0 border-none min-h-screen ml-[250px] px-8 mt-32 ">
        <Switch>
          <Route path={routes.app.auctions.default} component={AuctionsTabs} />
          <Route path={routes.app.users.default} component={Users} />
        </Switch>
      </div>
    </div>
  );
};

export default AppLayouts;
