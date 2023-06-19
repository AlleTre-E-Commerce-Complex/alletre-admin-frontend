import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import { useState } from "react";
import useAxios from "../../hooks/use-axios";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { truncateString } from "../../utils/truncate-string";
import moment from "moment";

import emtyPhotos from "../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../src/assets/icons/pen-icon.png";

export const DraftsItem = ({ img, itemName, date, auctionId, onReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();

  return (
    <>
      <div className="w-[154px] h-[139px] rounded-lg border-[1px] border-solid mb-14 relative mx-auto">
        {img ? (
          <img
            className="w-full h-full rounded-lg object-cover "
            src={img}
            alt="img"
          />
        ) : (
          <div className="w-full h-full rounded-lg object-cover">
            <img className="mx-auto pt-16" src={emtyPhotos} alt="emtyPhotos" />
          </div>
        )}
        <p className="text-gray-dark text-sm font-normal text-center pt-2">
          {truncateString(itemName, 15)}
        </p>
        <p
          dir="ltr"
          className="text-gray-med text-sm font-normal text-center pt-1"
        >
          {moment(date).format("D. MMM. YYYY")}
        </p>
      </div>
    </>
  );
};
