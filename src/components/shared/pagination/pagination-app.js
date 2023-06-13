import React from "react";
import { Pagination } from "semantic-ui-react";
import useFilter from "../../../hooks/use-filter";
import "../../../../src/assets/style/pagination-app.css";

const PaginationApp = ({ totalPages, perPage, myRef, myRef1 }) => {
  const [page, setPage] = useFilter("page", "1");
  const [perpage, setPerPage] = useFilter("perPage", perPage);
  return (
    <Pagination
      className="Edit_Pagination_App"
      defaultActivePage={1}
      ellipsisItem={null}
      firstItem={null}
      lastItem={null}
      secondary
      totalPages={totalPages}
      onPageChange={(e, data) => {
        window.scrollTo({
          behavior: "smooth",
          top: myRef?.current?.offsetTop,
        });
        window.scrollTo({
          behavior: "smooth",
          top: myRef1?.current?.offsetTop,
        });
        setPage(data?.activePage || page);
      }}
    />
  );
};

export default PaginationApp;
