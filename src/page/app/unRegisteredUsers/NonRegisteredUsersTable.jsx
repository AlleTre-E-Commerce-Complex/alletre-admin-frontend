import React, { useEffect, useState } from "react";
import {  Table } from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/language-context";
// import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import PaginationApp from "../../../components/shared/pagination/pagination-app";
import SuccessModal from "../../../components/shared/modal/SuccessModal";
import WalletManagementModal from "../../../components/users-components/WalletManagementModal";
import routes from "../../../routes";

const NonRegisteredUsersTable = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState();
  const [lang] = useLanguage("");
  // const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  // const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [SuccessModalMessage, setSuccessModalMessage] = useState("");

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  // const history = useHistory();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get("page"), 10);
  const perPage = parseInt(params.get("perPage"), 10);
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      try {
        run(
          authAxios
            .get(`${api.app.getAllNonRegisteredUsers}${search}`)
            .then((res) => {
              console.log("adminUsersTabel :", res?.data?.data);
              setActiveAuctionData(res?.data?.data?.users);
              setTotalPages(res?.data?.data?.pagination?.totalPages);
            })
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [run, forceReload, search]);
  const handleUpdateUserBlockStatus = (userId, currentStatus, userName) => {
    console.log("userId ****", userId, userName);
    run(
      authAxios
        .patch(`${api.app.updateUserBlockStatus(userId, currentStatus)}`)
        .then((res) => {
          console.log("response of is bloked :", res);
          if (res?.data?.success) {
            setOpenSuccessModal(true);
            setSuccessModalMessage(
              `You have successfully changed the blocking status of ${userName}`
            );
          } else {
            toast.error(`Failed Changing block status of user: ${userName}`);
          }
        })
    );
  };

  return (
    <>
      <div className="animate-in relative bg-white rounded-lg shadow-sm">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <LodingTestAllatre />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!activeAuctionData || activeAuctionData.length === 0) && (
          <div className="py-12 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
            <p className="text-sm text-gray-500">There are no unregistered users at the moment.</p>
          </div>
        )}
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full min-w-[750px] bg-transparent border-none">
            <Table.Header>
              <Table.Row className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
                <Table.HeaderCell className="rounded-l-xl py-4 px-6 font-semibold text-sm text-gray-700 text-left">
                  No.
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 px-6 font-semibold text-sm text-gray-700 text-left">
                  User Name
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 px-6 font-semibold text-sm text-gray-700 text-left hidden md:table-cell">
                  Email
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 px-6 font-semibold text-sm text-gray-700 text-left hidden lg:table-cell">
                  Phone Number
                </Table.HeaderCell>
                <Table.HeaderCell className="py-4 px-6 font-semibold text-sm text-gray-700 text-left hidden sm:table-cell">
                  Created At
                </Table.HeaderCell>
                {/* <Table.HeaderCell className="rounded-r-xl py-4 px-6 font-semibold text-sm text-gray-700 text-left">
                  Action
                </Table.HeaderCell> */}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {activeAuctionData?.map((e, index) => (
                <Table.Row
                  key={e?.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <Table.Cell className="py-4 px-6 text-sm text-gray-600 border-t">
                    {(page - 1) * perPage + index + 1}
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6 text-sm text-gray-600 border-t">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          src={userProfileicon}
                          alt={e?.name || "User"}
                        />
                      </div>
                      <p className="font-medium text-gray-900">
                        {e?.name || "----"}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6 text-sm text-gray-600 border-t hidden md:table-cell">
                    {e?.email || "----"}
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6 text-sm text-gray-600 border-t hidden lg:table-cell">
                    {e?.mobile || "----"}
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6 text-sm text-gray-600 border-t hidden sm:table-cell">
                    {new Date(e?.createdAt).toLocaleDateString("en-GB")}
                  </Table.Cell>
                  {/* <Table.Cell className="py-4 px-6 text-sm border-t">
                    <button
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                      onClick={() =>
                        handleUpdateUserBlockStatus(
                          e?.id,
                          e?.isBlocked,
                          e?.userName
                        )
                      }
                    >
                      Send Message
                    </button>
                  </Table.Cell> */}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 ">
          {!isLoading && activeAuctionData && activeAuctionData.length > 0 && 
            activeAuctionData.map((e, index) => (
            <div 
              key={e?.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Header with User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      src={userProfileicon}
                      alt={e?.name || "User"}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{e?.name || "----"}</h3>
                      <p className="text-sm text-gray-500">{e?.email || "----"}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    #{(page - 1) * perPage + index + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    {/* <span className="text-gray-500">Wallet Balance</span> */}
                    {/* <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{e?.wallet?.[e?.wallet?.length - 1]?.balance || "0"} AED</span>
                      <Button
                        className="bg-primary hover:bg-primary-dark transition-colors duration-200 !px-3 !py-1.5 text-xs"
                        primary
                        size="tiny"
                        onClick={() => {
                          setSelectedUser(e);
                          setIsWalletModalOpen(true);
                          setUserId(e?.id);
                        }}
                      >
                        Manage
                      </Button>
                    </div> */}
                  </div>
                  <div className="flex justify-between py-2 ">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900 font-medium">{e?.mobile || "----"}</span>
                  </div>
                  <div className="flex justify-between py-2 ">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-900">
                      {new Date(e?.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm text-sm font-medium"
                  onClick={() =>
                    handleUpdateUserBlockStatus(
                      e?.id,
                      e?.isBlocked,
                      e?.userName
                    )
                  }
                >
                  Send Message
                </button>
              </div>
            </div>
          ))}
          {/* Mobile Shimmer Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-32 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-8 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-t border-gray-50">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-50">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-8 px-4 md:px-6">
          <PaginationApp totalPages={totalPages} perPage={25} />
        </div>
        <SuccessModal
          open={openSuccessModal}
          setOpen={setOpenSuccessModal}
          returnUrl={routes.app.users.default}
          message={SuccessModalMessage}
        />
      </div>

      <WalletManagementModal
        open={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        userBalance={selectedUser?.wallet?.[selectedUser?.wallet?.length - 1]?.balance || 0}
        userId={userId}
      />
    </>
  );
};

export default NonRegisteredUsersTable;
