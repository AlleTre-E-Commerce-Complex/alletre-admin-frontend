const api = {
  auth: {
    login: "/auth/admin/sign-in",
    refreshtoken: "/auth/admin/refresh-token",
  },
  app: {
    allUser: "/users/admin/all",
    auctions: "/auctions/admin/all",
    auctionsById: (auctionsId) => `auctions/user/${auctionsId}`,

    //
    getUserAuctionsDetails: (auctionsId) =>
      `/auctions/user/${auctionsId}/details`,
    totalBids: (auctionsId) => `/auctions/user/${auctionsId}/total-bids`,
    //
    customField: {
      ByCategoryId: (categoryId) =>
        `/categories/custom-fields?categoryId=${categoryId}`,
      BySubCategoryId: (subCategoryId) =>
        `/categories/custom-fields?subCategoryId=${subCategoryId}`,
      systemField: `categories/system-fields`,
    },
    //
    category: {
      default: "/categories/all",
      uploadImages: (categoryId) => `/categories/${categoryId}/upload-images`,
    },
    subCategory: {
      default: (categoryId) =>
        `/categories/sub-categories?categoryId=${categoryId}`,
    },
  },
};

export default api;
