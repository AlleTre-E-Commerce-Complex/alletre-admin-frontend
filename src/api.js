const   api = {
  auth: {
    login: "/auth/admin/sign-in",
    refreshtoken: "/auth/admin/refresh-token",
  },
  app: {
    allUser: "/users/admin/all",
    auctions: "/auctions/admin/all",
    cancell_auction: (auctionId,adminMessage) =>
      `/auctions/admin/${auctionId}/cancel-auction?adminMessage=${adminMessage}`,
    auctionsById: (auctionsId) => `auctions/user/${auctionsId}`,
    //
    getUserAuctionsDetails: (auctionsId) =>
      `/auctions/user/${auctionsId}/details`,
    totalBids: (auctionsId) => `/auctions/user/${auctionsId}/total-bids`,
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
      uploadImages: (subcategoryId) =>
        `/categories/sub-categories/${subcategoryId}/upload-images`,
    },
    brand: {
      default: (categoryId) => `/categories/brands?categoryId=${categoryId}`,
      all: "/categories/brands",
    },
    systemField: {
      default: `/categories/system-fields`,
    },
    deliveryRequests: {
      getRequests : "/deliveryRequests/admin/get-delivery-request",
      updateStatus: (requestId) => `/deliveryRequests/admin/update-delivery-request?requestId=${requestId}`,
    },
    withdrawalsRequests: {
      get: "/withdrawalsRequests/admin/all",
      put: (auctionDetailsId) => {
        return `/withdrawalsRequests/${auctionDetailsId}/approve`;
      },
    },
  },
};

export default api;
