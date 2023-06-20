const routes = {
  auth: {
    default: `/auth`,
    logIn: `/auth/log-in`,
    signUp: `/auth/sign-Up`,
    enterEmail: `/auth/enter-email`,

    forgetpass: {
      default: `/credentials-update`,
      restpass: `/credentials-update/change-password`,
    },
  },
  app: {
    default: `/allatre-admin`,
    users: {
      default: `/allatre-admin/users`,
    },
    auctions: {
      default: `/allatre-admin/all-auctions`,
      active: `/allatre-admin/all-auctions/active`,
      scheduled: `/allatre-admin/all-auctions/scheduled`,
      drafts: `/allatre-admin/all-auctions/drafts`,
      sold: `/allatre-admin/all-auctions/sold`,
      pending: `/allatre-admin/all-auctions/pending`,
      watingForPayment: `/allatre-admin/all-auctions/wating-for-payment`,
      expired: `/allatre-admin/all-auctions/expired`,

      auctionsDetails: (auctionId = ":auctionId") =>
        `/allatre-admin/all-auctions/${auctionId}/details`,
    },
    category: {
      default: "/allatre-admin/category",
    },
    subGatogry: {
      default: "/allatre-admin/sub-gatogry",
    },
    brands: {
      default: "/allatre-admin/brands",
    },
    systemField: {
      default: "/allatre-admin/system-field",
    },
  },
};

export default routes;
