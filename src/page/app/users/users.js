import React, { useEffect } from "react";
import UsersTable from "../../../components/users-components/users-table";

const Users = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Users</h1>
      <div className="bg-gray-light rounded-2xl p-2 shadow-md">
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;
