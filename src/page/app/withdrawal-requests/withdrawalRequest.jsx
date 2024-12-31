import React, { useState, useEffect } from "react";
import { Dimmer, Table } from "semantic-ui-react";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import useAxios from "../../../hooks/use-axios";
import WithdrawalRequestModal from "../../../components/shared/modal/withdrawalRequestModal";

const WithdrawalRequest = () => {
  const { run, isLoading } = useAxios([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  console.log("refehing", refresh);
  const [selectedItem, setSelectedItem] = useState(null);
  const [withdrawalsRequests, setWithdrawalsRequests] = useState([]);

  useEffect(() => {
    const fetchWithdrawalsRequests = async () => {
      try {
        const response = await run(
          authAxios.get(`${api.app.withdrawalsRequests.get}`)
        );

        setWithdrawalsRequests(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        setWithdrawalsRequests([]); // Fallback to empty array
      }
    };

    fetchWithdrawalsRequests();
  }, [run, refresh]);

  const handleApprove = async (item) => {
    setSelectedItem(item);
    if (item.withdrawalStatus === "PENDING") {
      setIsModalOpen(true);
      return;
    }

    try {
      await authAxios.put(api.app.withdrawalsRequests.put(item.id), {
        withdrawalStatus: "IN_PROGRESS",
      });
      setRefresh((prev) => !prev);
    } catch (error) {}
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
        <h1 className="text-3xl text-black font-medium mx-5">
          Withdrawal Requests
        </h1>
        <Table className="bg-transparent border-none px-5 pt-8">
          <Table.Header>
            <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
              <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-left">
                User Name
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Phone Number
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Created At
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Amount
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Bank Account
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Status
              </Table.HeaderCell>
              <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-left">
                Action
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {withdrawalsRequests.length > 0 ? (
              withdrawalsRequests
                .sort((a, b) => b.id - a.id)
                .map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.user.userName}</Table.Cell>
                    <Table.Cell>{item.user.phone}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.user.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>{item.amount}</Table.Cell>
                    <Table.Cell>{item.bankAccount.accountNumber}</Table.Cell>
                    <Table.Cell>{item.withdrawalStatus}</Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleApprove(item)}
                        className={`px-4 py-2 rounded-md transition font-medium 
                        ${
                          item.withdrawalStatus === "SUCCESS"
                            ? "bg-gray-med text-gray-700 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dark text-white"
                        }`}
                        disabled={item.withdrawalStatus === "SUCCESS"}
                      >
                        {item.withdrawalStatus === "PENDING"
                          ? "Approve"
                          : item.withdrawalStatus === "IN_PROGRESS"
                          ? "Complete"
                          : "Processed"}
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="7" className="text-center">
                  No withdrawal requests available.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auctionDetails={selectedItem || {}}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default WithdrawalRequest;
