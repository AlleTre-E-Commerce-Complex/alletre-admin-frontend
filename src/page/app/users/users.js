import React, { useEffect } from "react";
import UsersTable from "../../../components/users-components/users-table";
import Upload_XL_file from "../unRegisteredUsers/Upload_XL_file";

const Users = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <div className="bg-gray-light rounded-2xl p-2 shadow-md">
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;
