import React, { useEffect } from "react";
import UsersTable from "../../../components/users-components/users-table";

const Users = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <div className="">
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;
