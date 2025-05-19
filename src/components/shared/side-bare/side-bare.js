import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { ReactComponent as AllatreLogo } from "../../../../src/assets/img/allatre-logo-color.svg";
import logOut from "../../../../src/assets/icons/log_out_icon.png";

import auth from "../../../utils/auth";
import routes from "../../../routes";

import { motion } from "framer-motion";
import { useLanguage } from "../../../context/language-context";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
// import api from "../../../api";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { setDeliveryRequests } from "../../../redux-store/delivery-requests-slice";
import { useSocket } from "../../../context/socket-context";
import api from "../../../api";

const Sidebar = ({ SetSid, sid }) => {
  const [lang] = useLanguage("");
  const socket = useSocket()
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const [pofileData, setPofileData] = useState();
  const { run, isLoading } = useAxios();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  // const { run: runPofile, isLoading: isLoadingPofile } = useAxios([]);
  // const { deliveryRequestsCount } = useSelector((state) => state.deliveryRequests);
  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState(0);
  const [bankTransferNotifications, setBankTransferNotifications] = useState(0);
  // useEffect(() => {
  //   setNotifications(deliveryRequestsCount)
  // }, [deliveryRequestsCount]);
  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications via socket
    socket.on('delivery:newNotification', (newNotification) => {
      console.log('delivery:newNotification',newNotification);
      setNotifications(prev => prev + 1)
      // Add the new notification to the existing requests
      
      // Dispatch the updated requests and the new count to the Redux store
      dispatch(setDeliveryRequests({ deliveryRequests: (prevRequests) => {
          const updatedRequests = [...prevRequests, newNotification];
          dispatch(setDeliveryRequests({ deliveryRequestsCount: updatedRequests.length }));
          return updatedRequests;
        } }));

    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off('delivery:newNotification');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    run(
      authAxios
        .get(api.app.deliveryRequests.getRequests('DELIVERY'))
        .then((res) => {
          const requests = res.data.data;
          console.log('delivery requests****>>>', requests);
          const newDeliveryReq = requests.filter(req => req.auction.deliveryRequestsStatus !== 'DELIVERY_SUCCESS')
          setNotifications(newDeliveryReq.length);
          
          // Dispatch once with both values
          dispatch(setDeliveryRequests({
            deliveryRequests: requests,
            deliveryRequestsCount: requests.length
          }));
        })
    );
  }, [run, dispatch, socket]);
  

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closedEn: {
      x: "-100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closedAr: {
      x: "100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  const onLogout = () => {
    auth.logout();
    history.push(routes.app.home);
    window.location.reload();
  };

  const handleDeliveryRequest = ()=>{
    setNotifications(0)
    dispatch(setDeliveryRequests({ deliveryRequestsCount: 0 }))
    history.push(routes.app.deliveryRequests.default)
  }
  const handleBankTransfer = () => {
    history.push(routes.app.bankTransfer.default)
  }
  return (
    <>
      <div className=" ">
        <motion.div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${sid ? "pointer-events-auto" : "pointer-events-none"}`}
          variants={overlayVariants}
          initial="closed"
          animate={sid ? "open" : "closed"}
          transition={{ duration: 0.3 }}
          onClick={() => SetSid(false)}
        />

        <motion.div
          className="h-full fixed top-0 z-50 w-[280px] bg-white shadow-xl overflow-hidden"
          variants={sidebarVariants}
          initial={lang === "en" ? "closedEn" : "closedAr"}
          animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <AllatreLogo className="w-32" />
              <button
                onClick={() => SetSid(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Copy all NavLinks from desktop version */}
              <NavLink
                title="Dashboard"
                isActive={pathname.startsWith(routes.app.dashboard.default)}
                onClick={() => {
                  history.push(routes.app.dashboard.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Users"
                isActive={pathname.startsWith(routes.app.users.default)}
                onClick={() => {
                  history.push(routes.app.users.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Auctions"
                isActive={pathname.startsWith(routes.app.auctions.default)}
                onClick={() => {
                  history.push(routes.app.auctions.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Categories"
                isActive={pathname.startsWith(routes.app.category.default)}
                onClick={() => {
                  history.push(routes.app.category.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Sub Categories"
                isActive={pathname.startsWith(routes.app.subGatogry.default)}
                onClick={() => {
                  history.push(routes.app.subGatogry.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Brands"
                isActive={pathname.startsWith(routes.app.brands.default)}
                onClick={() => {
                  history.push(routes.app.brands.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Withdrawal Requests"
                isActive={pathname.startsWith(routes.app.withdrawalRequest.default)}
                onClick={() => {
                  history.push(routes.app.withdrawalRequest.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Delivery Requests"
                isActive={pathname.startsWith(routes.app.deliveryRequests.default)}
                onClick={() => {
                  handleDeliveryRequest();
                  SetSid(false);
                }}
                notificationCount={notifications}
              />
              <NavLink
                title="Bank Transfer"
                isActive={pathname.startsWith(routes.app.bankTransfer.default)}
                onClick={() => {
                  handleBankTransfer();
                  SetSid(false);
                }}
                notificationCount={bankTransferNotifications}
              />
              <NavLink
                title="Admin Wallet"
                isActive={pathname.startsWith(routes.app.adminWallet.default)}
                onClick={() => {
                  history.push(routes.app.adminWallet.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Send Messages"
                isActive={pathname.startsWith(routes.app.sendMessages.default)}
                onClick={() => {
                  history.push(routes.app.sendMessages.default);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Users - Not Registered"
                isActive={pathname.startsWith(routes.app.nonRegisteredUsers.default)}
                onClick={() => {
                  history.push(routes.app.nonRegisteredUsers.default);
                  SetSid(false);
                }}
              />
            </div>
            <div
              onClick={() => {
                onLogout();
                SetSid(false);
              }}
              className="flex items-center justify-center gap-3 py-4 px-6 text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100 mt-auto"
            >
              <img className="w-5 h-5" src={logOut} alt="logOut" />
              <span className="text-sm font-medium">
                {selectedContent[localizationKeys.logout]}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export const NavLink = ({ title, onClick, isActive, notificationCount }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`w-full group transition-all duration-200 ${
          isActive
            ? "bg-primary-light/10 text-primary font-semibold"
            : "hover:bg-gray-50 text-gray-600"
        }`}
      >
        <div className="flex items-center px-6 py-4 space-x-3">
          {isActive && (
            <span className="w-1.5 h-8 bg-primary rounded-r-full absolute left-0" />
          )}
          <span className={`text-base ${isActive ? "font-semibold" : "font-medium"}`}>
            {title}
          </span>
          {notificationCount > 0 && (
            <span className="flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full min-w-[20px] h-5">
              {notificationCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};
export default Sidebar;
