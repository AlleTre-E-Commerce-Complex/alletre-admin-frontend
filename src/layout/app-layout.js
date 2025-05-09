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
import DeliveryRequests from "../page/app/deliveryRequests/DeliveryRequests";
import { SocketProvider } from "../context/socket-context";
import BankTransferRequests from "../page/app/bankTransfer/BankTransferRequests";
import AdminWallet from "../page/app/AdminWallet/AdminWallet";
import AdminMessageSender from "../page/app/SendMessages/SendMessages";
import NonRegisteredUsers from "../page/app/unRegisteredUsers/NonRegisteredUsers";
const AppLayouts = () => {
  console.log('app layout')
  const [sid, SetSid] = useState(false);
  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
        <SocketProvider>
      <div>
        <Header SetSid={SetSid} sid={sid} />
        <Sidebar SetSid={SetSid} sid={sid} />
      </div>
      <div className="p-0 m-0 border-none  px-4 md:px-8 mt-20 md:mt-32">
        <Switch>
          <Route
            path={routes.app.systemField.default}
            component={SystemFields}
            />
          <Route path={routes.app.brands.default} component={Brands} />
          <Route path={routes.app.deliveryRequests.default} component={DeliveryRequests} />
          <Route path={routes.app.bankTransfer.default} component={BankTransferRequests} />
          <Route path={routes.app.adminWallet.default} component={AdminWallet} />
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
          <Route path={routes.app.sendMessages.default} component={AdminMessageSender} />
          <Route path={routes.app.nonRegisteredUsers.default} component={NonRegisteredUsers} />

        </Switch>
      </div>
    </SocketProvider>
    </div>
  );
};

export default AppLayouts;
