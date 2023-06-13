import React from "react";
import "./input-form.css";

const InputForm = ({ type, placeholder, label, width, value, ...props }) => {
  return (
    <div id="floatContainer1" className="float-container text-primary-dark ">
      <label className="label_Input_Form">{label}</label>
      <input
        className="w-full rounded-lg border-[1px] h-[48px] focus:border-primary  .input_Input_Form rtl:font-serifAR ltr:font-serifEN px-4 outline-none placeholder:text-gray-med"
        type={type}
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputForm;
