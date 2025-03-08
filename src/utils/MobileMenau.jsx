import React from "react";
import { NavLink } from "react-router-dom";
import { Navlink_Title } from "../data";

function MobileMenu() {
  const isNavbarOpen = true; // You might need to pass this from a parent component

  return (
    <div className="bg-black w-screen h-screen text-3xl text-center flex justify-center items-center flex-col">
      <div className="flex flex-col items-center py-8 gap-6">
        {/* User Greeting */}
        <h1 className="text-white">Guest</h1>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 justify-center z-30 items-start w-full">
          {Navlink_Title.map((item, index) => (
            <span
              key={index}
              className={`${
                isNavbarOpen ? "justify-start" : "justify-center"
              } w-full flex py-2 pr-4 items-center`}
            >
              <NavLink
                to={`/${item.Link.replace(/^MobileMenu\//, "")}`} // Fixes incorrect link
                className="flex items-center justify-center gap-3 text-white"
              >
                <img
                  src={item.Icon}
                  alt={item.Tilte}
                  className="w-8 h-8 flex justify-center items-center"
                />
                {isNavbarOpen && (
                  <div className="text-sm font-small text-white flex justify-center items-start">
                    {item.Tilte}
                  </div>
                )}
              </NavLink>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
