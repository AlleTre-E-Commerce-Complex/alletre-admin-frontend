import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/allatre-logo-color.svg";
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
        .get(api.app.deliveryRequests.getRequests)
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
    window.location.reload();
    history.push(routes.app.home);
    auth.logout();
  };

  const handleDeliveryRequest = ()=>{
    setNotifications(0)
    dispatch(setDeliveryRequests({ deliveryRequestsCount: 0 }))
    history.push(routes.app.deliveryRequests.default)
  }
  return (
    <>
      <div className="h-screen fixed top-0 md:block hidden w-[250px] ">
        {/* content */}
        <div className="mt-40">
          <NavLink
            title="Users"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.users.default)
            }
            onClick={() => history.push(routes.app.users.default)}
          />
          <NavLink
            title="Auctions"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.auctions.default)
            }
            onClick={() => history.push(routes.app.auctions.default)}
          />
          <NavLink
            title="Categories"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.category.default)
            }
            onClick={() => history.push(routes.app.category.default)}
          />
          <NavLink
            title="Sub Categories"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.subGatogry.default)
            }
            onClick={() => history.push(routes.app.subGatogry.default)}
          />
          <NavLink
            title="Brands"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.brands.default)
            }
            onClick={() => history.push(routes.app.brands.default)}
          />
          <NavLink
            title="Withdrawal Requests"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.withdrawalRequest.default)
            }
            onClick={() => history.push(routes.app.withdrawalRequest.default)}
          />
           <NavLink
            title="Delivery Requests"
            isActive={pathname.startsWith(routes.app.deliveryRequests.default)}
            onClick={handleDeliveryRequest}
            notificationCount={notifications} // Pass notifications as a prop
          />
          {/* <NavLink
            title="System Fields"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.systemField.default)
            }
            onClick={() => history.push(routes.app.systemField.default)}
          /> */}
        </div>
        <div
          onClick={onLogout}
          className="flex justify-center gap-x-2 mt-12  cursor-pointer"
        >
          <img className="w-4 h-4 mt-0.5" src={logOut} alt="logOut" />
          <p className="text-gray-med text-sm font-normal underline">
            {selectedContent[localizationKeys.logout]}
          </p>
        </div>
      </div>
      <div className="block md:hidden">
        <motion.div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
            sid ? "pointer-events-auto" : "pointer-events-none"
          }`}
          variants={overlayVariants}
          initial="open"
          animate={sid ? "open" : "closed"}
          transition={{ duration: 0.3 }}
          onClick={() => SetSid(false)}
        />
        <motion.div
          className="h-full fixed top-0 z-50 w-[255px] bg-white "
          variants={sidebarVariants}
          initial={lang === "en" ? "closedEn" : "closedAr"}
          animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
        >
          <div className="">
            {/* content */}
            <div>
              <NavLink
                title="Users"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.users.default)
                }
                onClick={() => {
                  history.push(routes.app.users.default);
                  SetSid(false);
                }}
              />
            </div>
            <div
              onClick={onLogout}
              className="flex justify-center gap-x-2 mt-12  cursor-pointer"
            >
              <img className="w-4 h-4 mt-0.5" src={logOut} alt="logOut" />
              <p className="text-gray-med text-sm font-normal underline">
                {selectedContent[localizationKeys.logout]}
              </p>
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
      <p
        onClick={onClick}
        className={`${
          isActive
            ? "bg-primary-light/10 text-primary mx-0 px-10 font-bold"
            : "mx-10 px-4 border-b-gray-veryLight border-b-[1px]"
        } text-base text-gray-dark font-normal py-5 cursor-pointer flex items-center`}
      >
        <span
          className={`${
            isActive
              ? "bg-primary font-bold w-2 h-2 rounded-full mt-1.5 mx-4"
              : ""
          }`}
        ></span>
        <span className={`${isActive ? "font-bold" : ""}`}>{title}</span>
        {notificationCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </p>
    </div>
  );
};
export default Sidebar;
