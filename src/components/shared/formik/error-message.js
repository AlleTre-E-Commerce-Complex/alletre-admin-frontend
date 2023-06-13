import React from "react";
import { BiErrorCircle } from "react-icons/bi";

const ErrorMessage = ({ message }) => {
  return (
    <div className="mt-2 mb-2 px-2 font-normal flex items-center text-red-700">
      <BiErrorCircle className="ltr:mr-2 rtl:ml-2" />
      {message}
    </div>
  );
};

export default ErrorMessage;
