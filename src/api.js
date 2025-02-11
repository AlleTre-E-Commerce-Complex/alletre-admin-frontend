const   api = {
  auth: {
    login: "/auth/admin/sign-in",
    refreshtoken: "/auth/admin/refresh-token",
  },
  app: {
    allUser: "/users/admin/all",
    nonRegisteredUsers:'/users/non-registered-users/upload-excel',
    getAllNonRegisteredUsers:'/users/non-registered-users/get',
    updateUserBlockStatus :(userId, currentStatus) => 
      `users/admin/updateUserBlockStatus?userId=${userId}&currentStatus=${currentStatus}`,
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
      getCategory: (categoryId)=> `/categories/getOne/${categoryId}`,
      uploadImages: (categoryId) => `/categories/${categoryId}/upload-images`,
      createNewCategory:'/categories/createNewCategory',
      editCategory: (categoryId)=> `/categories/editCategory/${categoryId}`,

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
      getRequests :(deliveryType)=> `/deliveryRequests/admin/get-delivery-request?deliveryType=${deliveryType}`,
      updateStatus: (requestId) => `/deliveryRequests/admin/update-delivery-request?requestId=${requestId}`,
    },
    withdrawalsRequests: {
      get: "/withdrawalsRequests/admin/all",
      put: (auctionDetailsId) => {
        return `/withdrawalsRequests/${auctionDetailsId}/approve`;
      },
    },
    bankTransferRequests:{
      getRequests: "/auctions/admin/get-bankTransfer-request",
      updateStatus: (requestId) => `/auctions/admin/update-bankTransfer-request?requestId=${requestId}`,
    },
    adminWallet:{
      getAdminWalletDetails:"/wallet/get-admin-wallet-details",
      getAdminWalletBalance:"/wallet/get-admin-wallet-balance",
      getBankAccountBalance:"/wallet/get-account-balance",
    },
    sendMessage:{
      sendAuctionToAllUser:`/whatsapp/send-auction-bulk`
    }
  },
};

export default api;
