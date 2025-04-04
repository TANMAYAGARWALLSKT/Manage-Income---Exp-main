import React from "react";
import { NavLink } from "react-router-dom";
import { Navlink_Title } from "../data";

function MobileMenu() {
  const isNavbarOpen = true; // You might need to pass this from a parent component

  return (
    <div className=" absolute top-0 left-0 bg-gradient-to-b from-gray-900 to-black w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-md flex flex-col items-center py-8 px-4">
        {/* User Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome, Guest</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 w-full">
          {Navlink_Title.map((item, index) => (
            <NavLink
              key={index}
              to={`/${item.Link.replace(/^MobileMenu\//, "")}`}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              <div className="flex justify-center items-center w-10 h-10 bg-gray-900 rounded-full p-2">
                <img
                  src={item.Icon}
                  alt={item.Tilte}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-medium">{item.Tilte}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8">
          <div className="text-gray-500 text-sm">© 2025 Your Company</div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
