import React, { useState } from "react";

import { useHistory, useLocation } from "react-router-dom";

import routes from "../../../routes";

import useFilter from "../../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/img/allatre-logo-color.svg";

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
    <div className="w-full fixed top-0 bg-white shadow-sm h-20 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left section with menu and logo */}
          <div className="flex items-center">
            <button
              onClick={() => SetSid(true)}
              className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 "
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <AllatreLogo
              className="h-8 sm:h-10 w-auto cursor-pointer "
              onClick={() => history.push(routes.app.users.default)}
            />
          </div>

          {/* Right section with profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                  src={userProfileicon}
                  alt="Admin Profile"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-medium text-gray-900">Alletre Admin</h1>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
