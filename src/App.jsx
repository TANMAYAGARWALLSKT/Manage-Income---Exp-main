import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./utils/Navbar";
import Router from "./utils/Router";
import { auth } from "./utils/firebase";
import { store } from "./utils/store";
import { setUser } from "./utils/Redux";

// Create a wrapped component to use Redux hooks
function AppContent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.nav.user);
  const isNavbarOpen = useSelector((state) => state.nav.isNavbarOpen);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(
        setUser(
          user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }
            : null
        )
      );
    });

    const handleBeforeUnload = () => {
      if (auth.currentUser) {
        auth.signOut();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Fixes issue where state doesn't update correctly
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-900">
      {user && <Navbar />}
      <main
        className={`flex-1 transition-all duration-300 ${
          user && (isMobile ? "pt-16 w-full" : isNavbarOpen ? "ml-64" : "ml-20")
        }`}
      >
        <div
          className={`${
            isMobile ? "w-full px-0" : "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          } py-6`}
        >
          <Router />
        </div>
      </main>
    </div>
  );
}

// Main App component wrapped with Provider
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
