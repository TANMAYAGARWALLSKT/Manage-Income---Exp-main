import { React, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, User } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import LoginInfo from "../LoginInfo/LoginInfo";
import { Navlink_Title } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { toggleNav } from "../utils/Redux";
import { IconLogout } from "@tabler/icons-react";
import { CiMenuBurger } from "react-icons/ci";

function Navbar() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [userPhotoURL, setUserPhotoURL] = useState(
    "https://via.placeholder.com/150"
  );
  const [userName, setUserName] = useState(null);
  const [userMail, setUserMail] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  const dispatch = useDispatch();
  const isNavbarOpen = useSelector((state) => state.nav.isNavbarOpen);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setDate(new Date().toLocaleDateString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        setUserPhotoURL(user.photoURL);
      } else {
        setUserPhotoURL("https://via.placeholder.com/150");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (!showProfile) {
      setTimeout(() => {
        setShowProfile(false);
      }, 3000);
    }
  };

  const toggleNavbar = () => {
    dispatch(toggleNav());
  };

  return (
    <>
      {isMobile || isTablet ? (
        <MobileNavbar />
      ) : (
        <LaptopNavbar
          isNavbarOpen={isNavbarOpen}
          toggleNavbar={toggleNavbar}
          userPhotoURL={userPhotoURL}
          userName={userName}
          toggleProfile={toggleProfile}
          showProfile={showProfile}
          logout={logout}
        />
      )}
    </>
  );
}

export default Navbar;

function MobileNavbar() {
  return (
    <>
      <NavLink to="./MobileMenau">
        {" "}
        <div className=" absolute top-0 left-0 w-16 h-16 text-white  z-50 rounded-full ">
          <CiMenuBurger />
        </div>
      </NavLink>
      ``
    </>
  );
}

function LaptopNavbar({
  isNavbarOpen,
  toggleNavbar,
  userPhotoURL,
  userName,
  toggleProfile,
  showProfile,
  logout,
}) {
  return (
    <>
      <div
        className={`${
          isNavbarOpen ? "w-full sm:w-[12.5%]" : "w-20"
        } sticky top-0 left-0 h-full min-h-screen flex flex-col justify-between items-center py-5 bg-stone-100 text-zinc-800 shadow-md transition-all duration-300 rounded-r-3xl z-50`}
      >
        <div
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 cursor-pointer p-2 rounded-full shadow-lg"
          onClick={toggleNavbar}
        >
          {isNavbarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-gray-700 rotate-180 duration-175 ease-soft-spring"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          )}
        </div>

        <div className="flex flex-col items-center py-8 gap-6">
          <NavLink
            className={`${
              isNavbarOpen
                ? "flex flex-col items-center gap-2 cursor-pointer"
                : "flex flex-col items-center gap-2 cursor-pointer"
            }`}
            onClick={toggleProfile}
          >
            <img
              className={`${
                isNavbarOpen ? "h-24 w-24" : "h-10 w-10"
              } rounded-full border-2 border-gray-300 object-cover`}
              src={userPhotoURL}
              alt="User Profile"
            />
            <h1
              className={`${
                isNavbarOpen ? "text-xl" : "text-sm"
              } font-medium text-gray-800 text-center`}
            >
              {userName || "Guest"}
            </h1>
          </NavLink>

          <div className="flex flex-col  gap-2 justify-center items-start w-full">
            {Navlink_Title.map((item, index) => (
              <span
                key={index}
                className={`${
                  isNavbarOpen ? " justify-start" : "justify-center"
                } w-full flex py-2 pr-4   items-center `}
              >
                <NavLink
                  to={item.Link}
                  className=" flex items-center justify-center gap-3"
                >
                  <img
                    src={item.Icon}
                    alt={item.Tilte}
                    className={`${
                      isNavbarOpen ? "w-8 h-8" : "w-8 h-8"
                    } text-gray-700 flex justify-center items-center `}
                  />
                  {isNavbarOpen && (
                    <div className="text-sm font-small flex justify-center items-start  ">
                      {item.Tilte}
                    </div>
                  )}
                </NavLink>
              </span>
            ))}
          </div>
        </div>
        <div
          className=" flex justify-center items-center gap-3 "
          onClick={logout}
        >
          <IconLogout />
          {isNavbarOpen && (
            <h1 className="text-sm font-medium text-gray-800">Logout</h1>
          )}
        </div>
      </div>
    </>
  );
}
