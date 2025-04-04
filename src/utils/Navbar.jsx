import { React, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Navlink_Title } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { toggleNav } from "../utils/Redux";
import { IconLogout } from "@tabler/icons-react";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      const newIsMobile = window.innerWidth <= 768;
      const newIsTablet = window.innerWidth <= 1024;
      
      setIsMobile(newIsMobile);
      setIsTablet(newIsTablet);
      
      // Close mobile menu if window resizes to desktop
      if (!newIsMobile && !newIsTablet && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        setUserPhotoURL(user.photoURL || "https://via.placeholder.com/150");
        setUserMail(user.email);
      } else {
        setUserName("Guest");
        setUserPhotoURL("https://via.placeholder.com/150");
        setUserMail(null);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {isMobile || isTablet ? (
        <MobileNavbar 
          isOpen={mobileMenuOpen}
          toggleMenu={toggleMobileMenu}
          userPhotoURL={userPhotoURL}
          userName={userName}
          userMail={userMail}
          navItems={Navlink_Title}
          logout={logout}
          date={date}
          time={time}
        />
      ) : (
        <LaptopNavbar
          isNavbarOpen={isNavbarOpen}
          toggleNavbar={toggleNavbar}
          userPhotoURL={userPhotoURL}
          userName={userName}
          userMail={userMail}
          toggleProfile={toggleProfile}
          showProfile={showProfile}
          logout={logout}
          date={date}
          time={time}
        />
      )}
    </>
  );
}

export default Navbar;

function MobileNavbar({ isOpen, toggleMenu, userPhotoURL, userName, userMail, navItems, logout, date, time }) {
  const location = useLocation();
  
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMenu}
            className="text-zinc-800 focus:outline-none"
          >
            {isOpen ? (
              <IoCloseOutline className="w-8 h-8" />
            ) : (
              <CiMenuBurger className="w-8 h-8" />
            )}
          </button>
          <div className="text-lg font-medium text-zinc-800">Dashboard</div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-xs text-gray-500">{date}</div>
            <div className="text-sm font-medium">{time}</div>
          </div>
          <img
            src={userPhotoURL}
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-14 left-0 w-full h-full bg-white z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={userPhotoURL} 
              alt="User" 
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
            <div>
              <div className="font-medium">{userName}</div>
              {userMail && <div className="text-xs text-gray-500">{userMail}</div>}
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.Link}
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={toggleMenu}
                >
                  <img src={item.Icon} alt="" className="w-6 h-6" />
                  <span>{item.Tilte}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <IconLogout className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

function LaptopNavbar({
  isNavbarOpen,
  toggleNavbar,
  userPhotoURL,
  userName,
  userMail,
  toggleProfile,
  showProfile,
  logout,
  date,
  time
}) {
  const location = useLocation();
  
  return (
    <>
      <div
        className={`${
          isNavbarOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 h-full min-h-screen flex flex-col justify-between py-5 bg-white text-zinc-800 shadow-lg transition-all duration-300 z-50`}
      >
        <div
          className="absolute top-10 -right-3 transform bg-white hover:bg-gray-100 cursor-pointer p-2 rounded-full shadow-md"
          onClick={toggleNavbar}
        >
          {isNavbarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-gray-700"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-gray-700 rotate-180"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <div className="px-4 py-3 w-full">
            <div 
              className={`flex ${isNavbarOpen ? "flex-row items-center justify-start gap-3" : "flex-col items-center"} cursor-pointer mb-4`}
              onClick={toggleProfile}
            >
              <img
                className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                src={userPhotoURL}
                alt="User Profile"
              />
              {isNavbarOpen && (
                <div className="overflow-hidden">
                  <h1 className="text-sm font-medium truncate">{userName}</h1>
                  {userMail && <p className="text-xs text-gray-500 truncate">{userMail}</p>}
                </div>
              )}
            </div>
            
            {isNavbarOpen && (
              <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
                <div>{date}</div>
                <div>{time}</div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full px-3">
            <nav className="space-y-1">
              {Navlink_Title.map((item, index) => {
                const isActive = location.pathname === item.Link;
                return (
                  <NavLink
                    key={index}
                    to={item.Link}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <img
                      src={item.Icon}
                      alt=""
                      className="w-6 h-6"
                    />
                    {isNavbarOpen && (
                      <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                        {item.Tilte}
                      </span>
                    )}
                    {!isNavbarOpen && isActive && (
                      <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="px-3 mt-4">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200
            `}
          >
            <IconLogout className="w-5 h-5" />
            {isNavbarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main content margin */}
      <div className={`${isNavbarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}></div>
    </>
  );
}