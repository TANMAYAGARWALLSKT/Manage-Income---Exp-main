import { React, useState, useEffect, Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Income from "../Components/Income/Income";
import Expense from "../Components/Income/Expense/Expense";
import Testdaily from "../Components/Dailybook/Testdaily";
import Export from "../Components/Dailybook/Button_export";
import Indexpage from "../Components/Home/Indexpage";
import Auth from "../Components/Home/auth/main";
import { auth } from "./firebase";
import LoginInfo from "../LoginInfo/LoginInfo";
import { SparklesCore } from "../Components/ui/sparkles";
import { useSelector } from "react-redux";
import Vendor from "../Components/Vendor/Vendor";
import MobileMenau from "../utils/MobileMenau" ;
function Router() {
  const [currentAuth, setCurrentAuth] = useState(false);
  const isNavbarOpen = useSelector((state) => state.nav.isNavbarOpen);
  const user = useSelector((state) => state.nav.user);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Listener for Firebase authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setCurrentAuth(true);
      } else {
        // User is signed out
        setCurrentAuth(false);
      }
    });

    // Cleanup function to unsubscribe from the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const AuthReq = ({ children }) => {
    return currentAuth ? children : <Navigate to="/User" />;
  };

  return (
    <div>
      <div>
        <SparklesCore
          background="transparent"
          minSize={0.5}
          maxSize={0.7}
          particleDensity={200}
          className="w-full h-full absolute top-0 left-0 z-10"
          particleColor="#A8A29E"
        />
        <Routes>
          <Route
            path="/User"
            element={
              <div className="top-0 shadow-2xl shadow-black/70 bg-black absolute right-0 w-full sm:w-[96%] h-[96%] my-[1%] mx-0 sm:mx-[2%] overflow-hidden rounded-3xl flex justify-center items-center">
                <SparklesCore
                  background="transparent"
                  minSize={0.5}
                  maxSize={0.7}
                  particleDensity={200}
                  className="w-full h-full min-w-screen min-h-screen absolute top-0 left-0 z-10"
                  particleColor="#FFFFFF"
                />
                <Auth />
              </div>
            }
          />

          {/* Shared styles for authenticated routes */}
          {[
            {path:"/MobileMenau" ,Component : MobileMenau},
            { path: "/Home", Component: Indexpage },
            { path: "/Dashboard", Component: Indexpage },
            { path: "/", Component: Indexpage },
            { path: "/Income", Component: Income },
            { path: "/Expenses", Component: Expense },
            { path: "/Dailybook", Component: Testdaily },
            { path: "/UserInfo", Component: LoginInfo },
            { path: "/Vendor", Component: Vendor },
          ].map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <AuthReq>
                  {isMobile ? (
                    <div>
                      <Component />
                    </div>
                  ) : (
                    <div
                      className={`
                    top-0 
                    shadow-2xl 
                    overflow-hidden 
                    shadow-black/70 
                    bg-black 
                    absolute 
                    right-0 
                    w-full 
                    sm:w-[83%] 
                    h-[96%] 
                    my-[1%]
                    mx-0
                    sm:mx-[1%] 
                    rounded-3xl 
                    flex 
                    justify-center 
                    items-center
                    transition-[width,margin]
                    duration-300
                    ease-in-out
                    delay-200
                    ${!isNavbarOpen ? "sm:w-[92%]" : "sm:w-[83%]"}
                  `}
                    >
                      <Component />
                    </div>
                  )}
                </AuthReq>
              }
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default Router;
