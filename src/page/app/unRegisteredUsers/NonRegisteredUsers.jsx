import React, { useEffect } from "react";
import Upload_XL_file from "./Upload_XL_file";
import NonRegisteredUsersTable from "./NonRegisteredUsersTable";


const NonRegisteredUsers = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6">
        <h1 className="text-3xl text-black font-medium mb-4 md:mb-0">Users</h1>
        <Upload_XL_file />
      </div>
      <div className="py-4 md:py-6 overflow-hidden">
        <NonRegisteredUsersTable />
      </div>
    </div>
  );
};

export default NonRegisteredUsers;
