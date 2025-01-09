import { Tab } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import routes from "../../../routes";
import ActiveAuctions from "../../../components/auctions-tabs-components/active-auctions";
import ScheduledAuctions from "../../../components/auctions-tabs-components/scheduled-auctions";
import DraftsAuctions from "../../../components/auctions-tabs-components/drafts-auctions";
import SoldAuctions from "../../../components/auctions-tabs-components/sold-auctions";
import PendingAuctions from "../../../components/auctions-tabs-components/pending-auctions";
import WatingForPaymentAuctions from "../../../components/auctions-tabs-components/wating-for-payment-auctions";
import ExpiredAuctions from "../../../components/auctions-tabs-components/expired-auctions";
import useTab from "../../../hooks/use-tab";
import { useEffect } from "react";
import CancelledAuction from "../../../components/auctions-tabs-components/cancelledAuction";

const AuctionsTabs = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.active]}`,
      route: routes.app.auctions.active,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <ActiveAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.Scheduled]}`,
      route: routes.app.auctions.scheduled,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <ScheduledAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.drafts]}`,
      route: routes.app.auctions.drafts,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <DraftsAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.sold]}`,
      route: routes.app.auctions.sold,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <SoldAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.pending]}`,
      route: routes.app.auctions.pending,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light danimate-in">
            <PendingAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `Wating for payment`,
      route: routes.app.auctions.watingForPayment,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <WatingForPaymentAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.expired]}`,
      route: routes.app.auctions.expired,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <ExpiredAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.cancelled]}`,
      route: routes.app.auctions.cancelled,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-gray-light animate-in">
            <CancelledAuction />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="">
      <h1 className="text-3xl text-black font-medium py-5 mx-5">
        All Auctions
      </h1>
      <div className="h-auto edit-For-my-auctions-tabs animate-in bg-gray-light rounded-2xl p-2 shadow-md">
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            className: "flex overflow-x-scroll scrollbar-hide",
          }}
          activeIndex={activeIndex}
          onTabChange={onTabChange}
          panes={panes}
        />
      </div>
    </div>
  );
};

export default AuctionsTabs;
