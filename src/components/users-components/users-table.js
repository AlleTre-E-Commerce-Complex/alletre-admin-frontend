import React, { useEffect, useState } from "react";
import { Dimmer, Table, Input, Icon } from "semantic-ui-react";
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

const UsersTable = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [SuccessModalMessage, setSuccessModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
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
    if (activeAuctionData) {
      const filtered = activeAuctionData.filter(user =>
        user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
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
    <>
      <div className="animate-in">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>

        <div className="px-4 sm:px-6 py-6 sm:py-8 bg-gray-50 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h1>
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

          <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
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

          <div className="flex justify-end mt-6">
            <PaginationApp totalPages={totalPages} perPage={15} />
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
        </div>
      </div>
    </>
  );
};

export default UsersTable;
