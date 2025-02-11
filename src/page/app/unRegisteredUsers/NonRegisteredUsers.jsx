import React, { useEffect } from "react";
import Upload_XL_file from "./Upload_XL_file";
import NonRegisteredUsersTable from "./NonRegisteredUsersTable";


const NonRegisteredUsers = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Users</h1>
      <div className="bg-gray-light rounded-2xl p-2 shadow-md">
        <NonRegisteredUsersTable />
        <Upload_XL_file/>
      </div>
    </div>
  );
};

export default NonRegisteredUsers;
