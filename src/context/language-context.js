import React from "react";
import PropTypes from "prop-types";
import useLocalStorage from "../hooks/use-localstorage";

const LanguageContext = React.createContext();
LanguageContext.displayName = "LanguageContext"; // react dev tools doesn't display the name of the context

function LanguageProvider({ children }) {
  const [direction, setDirection] = useLocalStorage("direction", "ltr");
  const [language, setLocalStorageLanguage] = useLocalStorage("language", "en");

  React.useLayoutEffect(() => {
    let dir = direction;
    let lang = language;

    if (!["en", "ar"].includes(language)) {
      dir = "ltr";
      lang = "en";
      setLanguage(lang);
      setDirection(dir);
    }

    document.getElementsByTagName("html")[0].setAttribute("dir", dir);
    document.getElementsByTagName("html")[0].setAttribute("lang", lang);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLanguage(language) {
    const langDirection = language === "en" ? "ltr" : "rtl";
    setDirection(langDirection);

    document.getElementsByTagName("html")[0].setAttribute("dir", langDirection);
    document.getElementsByTagName("html")[0].setAttribute("lang", language);

    setLocalStorageLanguage(language);
  }

  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      {children}
    </LanguageContext.Provider>
  );
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useLanguage() {
 try {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
 } catch (error) {
  console.log(error)
 }
}

export { LanguageProvider, useLanguage };
