import React, { useState } from "react";

import { useHistory, useLocation } from "react-router-dom";

import routes from "../../../routes";

import useFilter from "../../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";

const Header = ({ SetSid }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const { search } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [serchShow, setSerchShow] = useState(false);

  const [name, setTitle] = useFilter("title", "");
  const debounced = useDebouncedCallback((value) => {
    setTitle(value);
    history.push(`${routes.app.home}?page=1&perPage=28&title=${value}`);
    window.scrollTo({
      behavior: "smooth",
      top: 950,
    });
  }, 850);

  return (
    <div className=" w-full fixed top-0  bg-white/30 backdrop-blur-md  ">
      <div className="flex justify-end  mx-14 pb-8 pt-3">
        <div className="w-[64px] h-12">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={userProfileicon}
            alt="userProfileicon"
          />
        </div>
        <div className="pt-1">
          <h1 className="text-base text-gray-dark font-medium ">
            {"Allatre Admin"}
          </h1>
          <p className="text-sm text-gray-med">{"Super Admin"}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
