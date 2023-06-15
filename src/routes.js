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
    },
  },
};

export default routes;
