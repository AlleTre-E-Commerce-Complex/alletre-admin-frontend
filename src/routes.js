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
    dashboard: {
      default: `/allatre-admin/dashboard`,
    },
    users: {
      default: `/allatre-admin/users`,
      complaints:`/allatre-admin/complaints`
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
      cancelled: `/allatre-admin/all-auctions/cancelled`,
      blocked: `/allatre-admin/all-auctions/blocked`,

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
    deliveryRequests: {
      default: "/allatre-admin/delivery-requests",
    },
    bankTransfer: {
      default: "/allatre-admin/bank-Transfer",
    },
    adminWallet: {
      default: "/allatre-admin/get-wallet-details"
    },
    withdrawalRequest: {
      default: "/allatre-admin/withdrawalRequest",
    },
    systemField: {
      default: "/allatre-admin/system-field",
    },
    sendMessages: {
      default: "/allatre-admin/send-message",
    },
    nonRegisteredUsers: {
      default: "/allatre-admin/non-registered-users",
    },
  },
};

export default routes;
