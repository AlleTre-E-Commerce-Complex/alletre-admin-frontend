import React from "react";
import { useHistory, useLocation } from "react-router-dom";

const useTab = ({ panes }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const history = useHistory();
  const { pathname } = useLocation();

  function onTabChange(e, { panes, activeIndex }) {
    history.replace(`${panes[activeIndex].route}`);
  }

  React.useEffect(() => {
    for (let i = 0; i < panes.length; i++)
      if (pathname.split("?")[0].startsWith(panes[i].route)) setActiveIndex(i);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return {
    activeIndex,
    onTabChange,
  };
};

export default useTab;
