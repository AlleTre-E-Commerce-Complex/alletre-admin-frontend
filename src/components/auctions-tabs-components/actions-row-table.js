import React, { useState } from "react";

import { truncateString } from "../../utils/truncate-string";
import AuctionsStatus from "../shared/status/auctions-status";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "../../utils/format-currency";
import moment from "moment";
import useCountdown from "../../hooks/use-countdown";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import WarningModal from "../shared/modal/WarningModal";
import SuccessModal from "../shared/modal/SuccessModal";

const ActionsRowTable = ({
  key,
  isBidsButtons,
  buttonActions,
  textButton,
  auctionsId,
  status,
  title,
  description,
  img,
  totalBids,
  startingPrice,
  startingDate,
  lastPrice,
  purchasePrice,
  price,
  endingTime,
  endingDate,
  goToDetails,
  filterJoinState,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const ending_Time = useCountdown(endingTime);
  const starting_Date = useCountdown(startingDate);
  const [openCancelAuctionModal, setCancelAuctionModal] = useState(false);
  const [openSuccessModal, setSuccessModal] = useState(false);
  const [cancelWarningMessage, setCancelWarningMessage] = useState("");

  const startingDateLeft = `${starting_Date.days} ${
    selectedContent[localizationKeys.days]
  } : ${starting_Date.hours} ${selectedContent[localizationKeys.hrs]} : ${
    starting_Date.minutes
  } ${selectedContent[localizationKeys.min]}`;
  const endingTimeLeft = `${ending_Time.days} ${
    selectedContent[localizationKeys.days]
  } : ${ending_Time.hours} ${selectedContent[localizationKeys.hrs]} : ${
    ending_Time.minutes
  } ${selectedContent[localizationKeys.min]}`;
  return (
    <div className="bg-background drop-shadow rounded-lg py-4 px-4 mb-2 animate-in">
      <div className="flex flex-wrap justify-between overflow-clip ">
        <div className="flex gap-x-4">
          <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9] cursor-default  ">
            {img ? (
              <img
                className="w-28 h-20 object-cover rounded-lg "
                src={img ? img : emtyPhotosIcon}
                alt="img"
              />
            ) : (
              <img
                className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg  "
                src={emtyPhotosIcon}
                alt="img"
              />
            )}
            <AuctionsStatus status={status} small absolute />
          </div>
          <div className="flex flex-col md:w-[400px] w-full ">
            <div>
              <h1 className="text-gray-dark text-sm font-medium">
                {truncateString(title, 80)}
              </h1>
              <p className="text-gray-med text-xs font-normal pt-1 ">
                {truncateString(description, 80)}
              </p>
            </div>
            {/* auctions */}
            {status === "ACTIVE" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {totalBids}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.lastPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {endingTimeLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "PENDING_OWNER_DEPOIST" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5 w-full  ">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal w-16">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal  ">
                    {formatCurrency(startingPrice)}
                  </p>
                </div>
                <div className="">
                  <h1 className="text-gray-veryLight text-[10px] font-normal w-20">
                    Creation Date
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment(startingDate).local().format("MMMM, DD YYYY")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.localStorage.setItem("auctionId", auctionsId);
                    history.push(routes.app.createAuction.paymentDetails);
                  }}
                  className="bg-secondary-light text-white text-xs px-2 rounded h-6 my-auto cursor-pointer w-auto"
                >
                  {selectedContent[localizationKeys.pendingDeposit]}
                </button>
              </div>
            )}
            {status === "IN_SCHEDULED" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.startingPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(startingPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.purchasePrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(purchasePrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.startDate]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {startingDateLeft}
                  </p>
                </div>
              </div>
            )}
            {status === "EXPIRED" || status === "SOLD" ? (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {totalBids}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.price]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(price)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingDate]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* March,23 2023 */}
                    {moment(endingDate).local().format("MMMM, DD YYYY")}
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* bids */}
            {status === "IN_PROGRESS" && (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal underline cursor-pointer">
                    {totalBids}
                    {/* {selectedContent[localizationKeys.bid]} */}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.purchasePrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {endingTimeLeft}
                  </p>
                </div>
              </div>
            )}

            {status === "PENDING_PAYMENT" ||
            status === "WAITING_FOR_DELIVERY" ||
            status === "PAYMENT_EXPIRED" ||
            status === "COMPLETED" ? (
              <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
                <div
                  className={
                    status === "WAITING_FOR_DELIVERY" ? "hidden" : "block"
                  }
                >
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.totalBids]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal underline cursor-pointer">
                    {totalBids}
                    {/* {selectedContent[localizationKeys.bid]} */}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.lastPrice]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {formatCurrency(lastPrice)}
                  </p>
                </div>
                <div>
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    {selectedContent[localizationKeys.endingTime]}
                  </h1>
                  <p className="text-gray-dark text-[10px] font-normal">
                    {/* 02 days.05 hrs.02 min */}
                    {status === "COMPLETED" || status === "PAYMENT_EXPIRED"
                      ? moment(endingDate).local().format("MMMM, DD YYYY")
                      : endingTimeLeft}
                  </p>
                </div>
                <div
                  className={status === "PAYMENT_EXPIRED" ? "block" : "hidden"}
                >
                  <h1 className="text-gray-veryLight text-[10px] font-normal">
                    status
                  </h1>
                  {filterJoinState === "PAYMENT_EXPIRED" ? (
                    <p className="text-gray-verydark text-[10px] font-normal flex gap-x-1.5">
                      <p className="w-2 h-2 rounded-full bg-gray-verydark my-auto"></p>
                      <p>Payment Expired</p>
                    </p>
                  ) : (
                    <p className="text-[#B9BDCD] text-[10px] font-normal flex gap-x-1.5">
                      <p className="w-2 h-2 rounded-full bg-[#B9BDCD] my-auto"></p>
                      <p>Lost Auction</p>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {isBidsButtons ? (
          <div className="flex gap-x-2">
            <button
              onClick={buttonActions}
              className="border-primary border-[1px] text-primary text-sm font-normal sm:w-[128px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 "
            >
              {textButton}
            </button>
            <button
              onClick={() => history.push(goToDetails)}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-normal sm:w-[128px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 "
            >
              {selectedContent[localizationKeys.viewDetails]}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
          {status === 'ACTIVE' || status === 'IN_SCHEDULED' ? (
            <button
              className="bg-primary hover:bg-primary-dark text-white text-sm font-normal sm:w-[128px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5"
              onClick={() => {
                setCancelAuctionModal(true);
                setCancelWarningMessage('Do you really want to cancell this auction..?');
              }}
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
          ) : null}

          <button
            onClick={() => history.push(goToDetails)}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-normal sm:w-[128px] w-full sm:h-8 h-10 rounded-lg sm:mt-14 mt-5 "
          >
            {selectedContent[localizationKeys.viewDetails]}
          </button>
          
          </div>
        )}
      </div>

      <WarningModal
        auctionId={auctionsId}
        open={openCancelAuctionModal}
        setOpen={setCancelAuctionModal}
        setSuccessModal={setSuccessModal}
        message={cancelWarningMessage}
      />
      <SuccessModal
        open={openSuccessModal}
        setOpen={setSuccessModal}
        message={
          selectedContent[localizationKeys.YouSuccessfullyCancelledTheAuction]
        }
        returnUrl={routes.app.auctions.cancelled}
      />
    </div>
  );
};

export default ActionsRowTable;
