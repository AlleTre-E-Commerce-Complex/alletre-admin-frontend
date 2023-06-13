import React from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

// DRAFTED - PENDING_OWNER_DEPOIST-PUBLISHED-ARCHIVED-SOLD-EXPIRED
// ON_TIME - SCHEDULED

const AuctionsStatus = ({ status, small, big, absolute }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <div>
      {status === "ACTIVE" && (
        <button
          className={`state-button
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-green bg-green-light top-0`}
        >
          {selectedContent[localizationKeys.activeNow]}
        </button>
      )}
      {status === "IN_SCHEDULED" && (
        <button
          className={`state-button
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-yellow bg-yellow-light top-0`}
        >
          {selectedContent[localizationKeys.Scheduled]}
        </button>
      )}
      {status === "SOLD" && (
        <button
          className={`state-button  
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-primary-dark bg-primary-veryLight top-0`}
        >
          {selectedContent[localizationKeys.sold]}
        </button>
      )}
      {status === "PENDING_OWNER_DEPOIST" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
            font-normal text-secondary bg-secondary-light top-0`}
        >
          {selectedContent[localizationKeys.pending]}
        </button>
      )}
      {status === "EXPIRED" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-gray-dark bg-gray-veryLight top-0`}
        >
          {selectedContent[localizationKeys.expired]}
        </button>
      )}
      {status === "IN_PROGRESS" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-green bg-green-light top-0`}
        >
          in progress
        </button>
      )}
      {status === "PENDING_PAYMENT" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[0.5rem]"}
          ${big && "w-24 h-7 text-base"}
          ${absolute && "absolute"}
          font-normal text-secondary bg-secondary-light top-0`}
        >
          {selectedContent[localizationKeys.pending]}
        </button>
      )}
    </div>
  );
};

export default AuctionsStatus;
