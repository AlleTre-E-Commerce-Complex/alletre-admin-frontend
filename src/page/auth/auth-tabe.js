import React from "react";

import { Dropdown, Tab } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";
import routes from "../../routes";

import oAuthImg from "../../../src/assets/img/o-auth-img.png";
import oAuthFooterImg from "../../../src/assets/img/o-auth-path-footer.svg";
import allatreLogoWhite from "../../../src/assets/logo/allatre-logo-white.svg";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LogIn from "./log-in";
import SignUp from "./sign-up";

const AuthTabe = () => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.login]}`,
      route: routes.auth.logIn,
      render: () => (
        <div>
          <Tab.Pane className="border-none h-full animate-in md:pt-10 pt-0 flex justify-center">
            <LogIn />
          </Tab.Pane>
        </div>
      ),
    },

    {
      menuItem: `${selectedContent[localizationKeys.signup]}`,
      route: routes.auth.signUp,
      render: () => (
        <div>
          <Tab.Pane className="border-none h-full animate-in pt-2 flex justify-center ">
            <SignUp />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });
  return (
    <div className="animate-in h-screen">
      <div>
        <div className="">
          <div className="relative">
            <img
              className="w-full h-64 md:h-full object-cover"
              src={oAuthImg}
              alt="oAuthImg"
            />
            <img
              className="absolute z-50 md:top-1/3 top-1/4 ltr:md:ml-40 rtl:md:mr-40 ltr:ml-2 rtl:mr-2  mt-5 w-40 md:w-auto "
              src={allatreLogoWhite}
              alt="allatreLogoWhite"
            />
            <div className=" md:mx-10 mx-2 absolute top-2 rtl:left-0 ltr:right-0 ">
              <Dropdown
                className="text-xl text-white pt-6 "
                text={lang === "en" ? "Language" : "اللغة"}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setLang("en");
                    }}
                  >
                    {lang === "en" ? "English" : "الانجليزية"}
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item
                    onClick={() => {
                      setLang("ar");
                    }}
                  >
                    {lang === "en" ? "Arabic" : "العربية"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div
            className={` mx-auto h-auto w-full relative bottom-[99px] edit-For-o-auth-tabs m-0 `}
          >
            <Tab
              menu={{
                secondary: true,
                pointing: true,
                className:
                  "flex flex-wrap text-xl ltr:md:pl-40 rtl:md:pr-40 ltr:pl-2 rtl:pr-2 m-0",
              }}
              activeIndex={activeIndex}
              onTabChange={onTabChange}
              panes={panes}
            />
          </div>
          <img
            className="w-full object-cover h-32 md:h-auto fixed bottom-0 -z-10 "
            src={oAuthFooterImg}
            alt="oAuthFooterImg"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthTabe;
