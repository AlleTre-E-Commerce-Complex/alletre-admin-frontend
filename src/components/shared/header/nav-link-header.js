import React from "react";
import "./nav-link-header.css";

const NavLinkHeader = ({ title, onClick, isActive, className }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive
            ? "active-underline-animation text-primary "
            : "hover-underline-animation"
        } lg:text-base text-xs font-normal hover:text-primary ${className} `}
      >
        {title}
      </p>
    </div>
  );
};

export default NavLinkHeader;
