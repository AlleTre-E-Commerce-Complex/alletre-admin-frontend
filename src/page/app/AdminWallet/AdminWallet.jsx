import React, { useEffect, useState } from "react";

// // import AddNewBankModal from "component/shared/withdrawalModal/AddNewBankModal";
// import SuccessModal from "component/shared/successModal/SuccessModal";
// import ShowBankDetailsModal from "component/shared/withdrawalModal/ShowBankDetailsModal";
// import routes from "routes";
import api from "../../../api";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import { Dimmer, Icon, Button } from "semantic-ui-react";
import WalletManagementModal from "../../../components/users-components/WalletManagementModal";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import localizationKeys from "../../../localization/localization-keys";
const AdminWallet = () => {

  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run: runWallet, isLoading: isLoadingWallet } = useAxios([])
  const [walletBalance, setWalletBalance] = useState(0);
  const [accountBalanceWithWelcomBonus, setAccountBalanceWithWelcomBonus] = useState(0);
  const [accountBalanceWithOutWelcomBonus, setAccountBalanceWithOutWelcomBonus] = useState(0);
  const [walletHistory, setWalletHistory] = useState([]);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [historyResponse, balanceResponse, accountResponse] = await Promise.all([
          runWallet(authAxios.get(`${api.app.adminWallet.getAdminWalletDetails}`)),
          runWallet(authAxios.get(`${api.app.adminWallet.getAdminWalletBalance}`)),
          runWallet(authAxios.get(`${api.app.adminWallet.getBankAccountBalance}`)),
        ]);

        setWalletHistory(historyResponse?.data);
        console.log('wallet history* :', historyResponse?.data)
        setWalletBalance(balanceResponse?.data);
        setAccountBalanceWithWelcomBonus(accountResponse?.data?.accountBalanceWithWelcomeBonus)
        setAccountBalanceWithOutWelcomBonus(accountResponse?.data?.accountBalanceWithOutWelcomeBonus)
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, [runWallet]);


  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: "numeric", // optional
      hour12: true, // set to false if you prefer 24-hour time
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  async function handleWithdrawClick() {
    setWithdrawalOpen(true)


  }


  return (
    <div>
      <Dimmer className=" bg-white/50" active={isLoadingWallet} inverted>
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="">
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className=" mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Wallet Overview</h1>
              <Button
                className="bg-primary hover:bg-primary-dark transition-colors duration-200"
                primary
                icon
                labelPosition="left"
                onClick={() => setIsWalletModalOpen(true)}
              >
                <Icon name="plus" />
                Add Transaction
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full bg-blue-400/10 group-hover:scale-110 transition-transform duration-200"></div>
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Icon name="money bill alternate outline" className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-sm font-semibold text-blue-900/90 uppercase tracking-wider">
                    {selectedContent[localizationKeys.WalletBalance]}
                  </h2>
                </div>
                <div className="flex items-baseline gap-1 relative">
                  <span className="text-xl font-semibold text-blue-900/75">AED</span>
                  <span className="text-3xl font-bold text-blue-900">{(Number(walletBalance) || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Account With Welcome Bonus Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full bg-green-400/10 group-hover:scale-110 transition-transform duration-200"></div>
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Icon name="gift" className="text-green-600 text-xl" />
                  </div>
                  <h2 className="text-sm font-semibold text-green-900/90 uppercase tracking-wider">
                    Account With Bonus
                  </h2>
                </div>
                <div className="flex items-baseline gap-1 relative">
                  <span className="text-xl font-semibold text-green-900/75">AED</span>
                  <span className="text-3xl font-bold text-green-900">{(Number(accountBalanceWithWelcomBonus) || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Account Without Welcome Bonus Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full bg-purple-400/10 group-hover:scale-110 transition-transform duration-200"></div>
                <div className="flex items-center gap-3 mb-3 relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Icon name="id badge outline" className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-sm font-semibold text-purple-900/90 uppercase tracking-wider">
                    Account Without Bonus
                  </h2>
                </div>
                <div className="flex items-baseline gap-1 relative">
                  <span className="text-xl font-semibold text-purple-900/75">AED</span>
                  <span className="text-3xl font-bold text-purple-900">{(Number(accountBalanceWithOutWelcomBonus) || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="transactions mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-gray-500">
                <thead className="text-xs text-white uppercase bg-primary sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary first:rounded-tl-xl">
                      {selectedContent[localizationKeys.Date]}
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary">
                      {selectedContent[localizationKeys.Description]}
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary">
                      Auction Product
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary text-center">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider bg-primary text-right last:rounded-tr-xl">
                      {selectedContent[localizationKeys.Balance]}
                    </th>
                  </tr>
                </thead>
                {walletHistory.length > 0 ? (
                  <tbody>
                    {[...walletHistory].reverse().map((data, index) => (
                      <tr
                        key={index}
                        className={`bg-white border-b hover:bg-gray-50 ${index % 2 !== 0 ? "bg-gray-50" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(data.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                              <Icon name="user" className="text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{data.user?.userName || 'Unknown User'}</span>
                              <span className="text-xs text-gray-500">{data.user?.email || ''}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{data.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{data?.auction?.product?.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <img className="w-52 h-20 object-cover rounded-lg " src={data?.auction?.product?.images[0]?.imageLink} alt="img" />
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                             ${data.status === "WITHDRAWAL"
                              ? 'bg-red-50 text-red-700'
                              : 'bg-green-50 text-green-700'}`
                          }>
                            <Icon
                              name={data.status === "WITHDRAWAL" ? 'arrow up' : 'arrow down'}
                              className={data.status === "WITHDRAWAL" ? 'text-red-600' : 'text-green-600'}
                            />
                            AED {(Number(data.amount) || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className="font-medium text-gray-900">AED {(Number(data.balance) || 0).toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="5" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Icon name="file outline" className="text-4xl text-gray-400 mb-3" />
                          <h3 className="text-gray-500 font-medium">
                            {selectedContent[localizationKeys.ThereAreNoTransactionYet]}
                          </h3>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        {/* {withdrawalOpen && (
           <ShowBankDetailsModal
             open={withdrawalOpen}
             setOpen={setWithdrawalOpen}
             setWithdrawalAmount={setWithdrawalAmount}
             accountBalance={walletBalance}
           />
         )} */}
        {/* {successModalOpen && (
           <SuccessModal
             open={successModalOpen}
             setOpen={setSuccessModalOpen}
             returnUrl={routes.app.profile.wallet}
             message={'Success! Your withdrawal request has been processed successfully. Your funds are on their way, and you’ll receive them shortly. Thank you for using our service!'}
             isWithdrawal={true}
           />
         )} */}
        <WalletManagementModal
          open={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          userBalance={walletBalance || 0}
          isAdmin
        />
      </div>
    </div>
  );
};

export default AdminWallet;
