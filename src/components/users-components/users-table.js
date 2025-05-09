import React, { useEffect, useState } from "react";
import { Dimmer, Table, Input, Icon, Button } from "semantic-ui-react";
import useAxios from "../../hooks/use-axios";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import PaginationApp from "../shared/pagination/pagination-app";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import SuccessModal from "../shared/modal/SuccessModal";
import ConfirmationModal from "../shared/modal/ConfirmationModal";
import routes from "../../routes";
import toast from "react-hot-toast";
import WalletManagementModal from './WalletManagementModal';

const UsersTable = () => {
  const [lang] = useLanguage("");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [SuccessModalMessage, setSuccessModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userId, setUserId] = useState()
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    userId: null,
    userName: '',
    isBlocked: false
  });

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      try {
        run(
          authAxios.get(`${api.app.allUser}${search}`).then((res) => {
            console.log('adminUsersTabel :', res?.data?.data)
            setActiveAuctionData(res?.data?.data?.users);
            setTotalPages(res?.data?.data?.pagination?.totalPages);
          })
        );
      } catch (error) {
        console.log(error)
      }
    }
  }, [run, forceReload, search]);

  useEffect(() => {
    try {
      if (activeAuctionData) {
        const filtered = activeAuctionData.filter(user =>
          user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
      }
    } catch (error) {
      console.log(error)
    }
  }, [searchQuery, activeAuctionData]);

  const handleUpdateUserBlockStatus = (userId, currentStatus, userName) => {
    run(
      authAxios.patch(`${api.app.updateUserBlockStatus(userId, currentStatus)}`).then((res) => {
        if (res?.data?.success) {
          setOpenSuccessModal(true);
          setSuccessModalMessage(`You have successfully changed the blocking status of ${userName}`);
          setConfirmationModal(prev => ({ ...prev, open: false }));
          setForceReload(prev => !prev);
        } else {
          toast.error(`Failed Changing block status of user : ${userName}`);
        }
      })
    );
  };

  const handleBlockAction = (userId, isBlocked, userName) => {
    setConfirmationModal({
      open: true,
      userId,
      userName,
      isBlocked
    });
  };

  const handleConfirmBlock = () => {
    const { userId, isBlocked, userName } = confirmationModal;
    handleUpdateUserBlockStatus(userId, isBlocked, userName);
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="relative">
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
            <p className="text-sm text-gray-500">There are no users at the moment.</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-96">
              <Input
                icon={<Icon name="search" color="grey" />}
                placeholder="Search by name, email or phone..."
                fluid
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full shadow-sm !bg-white rounded-lg"
                size="large"
              />
            </div>
          </div>
        </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="bg-transparent border-none min-w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50 border-b border-gray-200">
                  <Table.HeaderCell className="hidden sm:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    No.
                  </Table.HeaderCell>
                  <Table.HeaderCell className="font-semibold text-md text-gray-700 text-left p-5">
                    User Info
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden sm:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Manage Wallet
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden sm:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Wallet Balance
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden md:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Email
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden lg:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Phone Number
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden lg:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Created At
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden md:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Total Auctions
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden md:table-cell font-semibold text-md text-gray-700 text-left p-5">
                    Joined Auctions
                  </Table.HeaderCell>
                  <Table.HeaderCell className="font-semibold text-md text-gray-700 text-left p-5">
                    Action
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              {(searchQuery ? filteredData : activeAuctionData)?.map((e, index) => (
                <Table.Body key={e.id}>
                  <Table.Row className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <Table.Cell className="hidden sm:table-cell text-gray-600 text-md p-5">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="text-gray-600 text-md p-5">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-gray-100">
                          <img
                            className="w-full h-full object-cover"
                            src={e?.imageLink || userProfileicon}
                            alt={e?.userName}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-800">{e?.userName || "----"}</p>
                          <div className="sm:hidden space-y-2 mt-2 text-sm text-gray-500">
                            <p className="flex items-center gap-2">
                              <Icon name="money" size="small" />
                              <span>Balance: {e?.wallet?.[e?.wallet?.length - 1]?.balance || "0"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon name="mail" size="small" />
                              <span>{e?.email || "----"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Icon name="phone" size="small" />
                              <span>{e?.phone || "----"}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="hidden sm:table-cell text-gray-600 text-md p-5">
                      <div>
                        <Button
                          className="bg-primary hover:bg-primary-dark transition-colors duration-200 !px-3 !py-1.5 text-xs"
                          primary
                          size="tiny"
                          onClick={() => {
                            setSelectedUser(e);
                            setIsWalletModalOpen(true);
                            setUserId(e?.id)
                          }}
                        >
                          Manage Wallet
                        </Button>

                        <WalletManagementModal
                          open={isWalletModalOpen}
                          onClose={() => setIsWalletModalOpen(false)}
                          userBalance={selectedUser?.wallet?.[selectedUser?.wallet?.length - 1]?.balance || 0}
                          userId={userId}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell className="hidden sm:table-cell text-gray-600 text-md p-5">
                      <span className="font-medium text-gray-800">{e?.wallet?.[e?.wallet?.length - 1]?.balance || "0"}</span>
                      <span className="text-gray-500 ml-1">AED</span>
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell text-gray-600 text-md p-5">
                      {e?.email || "----"}
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell text-gray-600 text-md p-5">
                      {e?.phone || "----"}
                    </Table.Cell>
                    <Table.Cell className="hidden lg:table-cell text-gray-600 text-md p-5">
                      {new Date(e?.createdAt).toLocaleDateString("en-GB")}
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell text-gray-600 text-md p-5">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {e?._count?.auctions}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell text-gray-600 text-md p-5">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-purple-50 text-purple-600 font-medium">
                        {e?._count?.JoinedAuction}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-gray-600 text-md p-5">
                      <button
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      ${e?.isBlocked
                            ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                            : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                          }`}
                        onClick={() => handleBlockAction(e?.id, e?.isBlocked, e?.userName)}
                      >
                        <Icon name={e?.isBlocked ? 'unlock' : 'lock'} className="w-4 h-4" />
                        {e?.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </Table.Cell>

                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {!isLoading && (searchQuery ? filteredData : activeAuctionData)?.length > 0 && 
              (searchQuery ? filteredData : activeAuctionData).map((e, index) => (
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
                        src={e?.imageLink || userProfileicon}
                        alt={e?.userName}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{e?.userName || "----"}</h3>
                        <p className="text-sm text-gray-500">{e?.email || "----"}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Wallet Balance</span>
                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-900 font-medium">{e?.phone || "----"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-900">
                        {new Date(e?.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Total Auctions</span>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {e?._count?.auctions}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Joined Auctions</span>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-purple-50 text-purple-600 font-medium">
                        {e?._count?.JoinedAuction}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${e?.isBlocked
                      ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                      : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                    }`}
                    onClick={() => handleBlockAction(e?.id, e?.isBlocked, e?.userName)}
                  >
                    <Icon name={e?.isBlocked ? 'unlock' : 'lock'} className="w-4 h-4" />
                    {e?.isBlocked ? 'Unblock' : 'Block'}
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
            <PaginationApp totalPages={totalPages} perPage={1000} />
          </div>
        </div>
        <SuccessModal
        open={openSuccessModal}
        setOpen={setOpenSuccessModal}
        returnUrl={routes.app.users.default}
        message={SuccessModalMessage}
      />
      <ConfirmationModal
        open={confirmationModal.open}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmBlock}
        title={confirmationModal.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${confirmationModal.isBlocked ? 'unblock' : 'block'} ${confirmationModal.userName}?`}
        confirmText={confirmationModal.isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
      />
      <WalletManagementModal
        open={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        userBalance={selectedUser?.wallet?.[selectedUser?.wallet?.length - 1]?.balance || 0}
        userId={userId}
      />
      </div>
     
   
  );
};

export default UsersTable;
