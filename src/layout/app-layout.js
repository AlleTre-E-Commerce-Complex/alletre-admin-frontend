import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/side-bare/side-bare";
import Header from "../components/shared/header/header";
import routes from "../routes";
import Users from "../page/app/users/users";
import AuctionsTabs from "../page/app/auctions/auctions-tabs";
import AuctionsDetails from "../components/auctions-tabs-components/auctions-details";
import Category from "../page/app/category/category";
import SubCategory from "../page/app/sub-category/sub-category";
import Brands from "../page/app/brands/brands";
import SystemFields from "../page/app/system-fields/system-fields";
import WithdrawalRequest from "../page/app/withdrawal-requests/withdrawalRequest";

const AppLayouts = () => {
  const [sid, SetSid] = useState(false);
  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <div>
        <Header SetSid={SetSid} sid={sid} />
        <Sidebar SetSid={SetSid} sid={sid} />
      </div>
      <div className="p-0 m-0 border-none min-h-screen ml-[250px] px-8 mt-32 ">
        <Switch>
          <Route
            path={routes.app.systemField.default}
            component={SystemFields}
          />
          <Route path={routes.app.brands.default} component={Brands} />
          <Route path={routes.app.subGatogry.default} component={SubCategory} />
          <Route path={routes.app.category.default} component={Category} />
          <Route
            path={routes.app.auctions.auctionsDetails()}
            component={AuctionsDetails}
          />
          <Route path={routes.app.auctions.default} component={AuctionsTabs} />
          <Route path={routes.app.users.default} component={Users} />
          <Route
            path={routes.app.withdrawalRequest.default}
            component={WithdrawalRequest}
          />
        </Switch>
      </div>
    </div>
  );
};

export default AppLayouts;
