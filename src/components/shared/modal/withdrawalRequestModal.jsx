import React from "react";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";

const WithdrawalRequestModal = ({
  isOpen,
  onClose,
  auctionDetails,
  setRefresh,
}) => {
  if (!isOpen) return null;

  const handleOnApprove = async () => {
    onClose();
    setRefresh((prev) => !prev);
    try {
      await authAxios.put(api.app.withdrawalsRequests.put(auctionDetails.id), {
        withdrawalStatus: "PENDING",
      });
    } catch (error) {}
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative z-10 transform transition-transform scale-95 sm:scale-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">
            Approve Requests
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 transition"
            onClick={onClose}
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 mt-2">
          Are you sure you want to approve this amount? Please review the
          details below:
        </p>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-medium text-gray-700">User Name:</span>{" "}
            {auctionDetails.user.userName}
          </p>
          <p>
            <span className="font-medium text-gray-700">Phone Number:</span>{" "}
            {auctionDetails.user.phone}
          </p>
          <p>
            <span className="font-medium text-gray-700">Created At:</span>{" "}
            {auctionDetails.user.createdAt}
          </p>
          <p>
            <span className="font-medium text-gray-700">Amount:</span>{" "}
            {auctionDetails.amount}
          </p>
          <p>
            <span className="font-medium text-gray-700">Bank Account:</span>{" "}
            {auctionDetails.bankAccount.accountNumber}
          </p>
          <p>
            <span className="font-medium text-gray-700">Status:</span>{" "}
            {auctionDetails.withdrawalStatus}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition"
            onClick={() => {
              handleOnApprove();
            }}
          >
            Yes, Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequestModal;
