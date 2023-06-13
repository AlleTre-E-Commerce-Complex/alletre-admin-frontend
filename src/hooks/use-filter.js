import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

// function useQuery() {
//   return new URLSearchParams(window.location.search);
// }

const useFilter = (name, value = "") => {
  const [filter, setFilter] = React.useState(value);

  const history = useHistory();
  const { search } = useLocation();

  const onFilterChange = (newVal) => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });
    parsed[name] = newVal;

    history.replace(
      `?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`
    );
  };

  React.useEffect(() => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });

    if (!parsed[name] && (value || value.length)) {
      onFilterChange(value);
      setFilter(value);
    } else {
      setFilter(parsed[name] || value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return [filter, onFilterChange];
};

export default useFilter;
