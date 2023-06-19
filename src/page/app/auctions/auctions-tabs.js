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

const AuctionsTabs = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.active]}`,
      route: routes.app.auctions.active,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray  dark:bg-darkMood-backgroundBlack animate-in">
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
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray  dark:bg-darkMood-backgroundBlack animate-in">
            <ExpiredAuctions />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });

  return (
    <div className="">
      <h1 className="text-3xl text-black font-medium py-5 mx-5">
        All Auctions
      </h1>
      <div className="h-auto edit-For-my-auctions-tabs  animate-in ">
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
