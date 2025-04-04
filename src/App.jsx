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
    <div
      className={`Font flex items-center ${
        isMobile
          ? " overflow-x-hidden overflow-y-scroll bg-black w-full h-full min-w-screen"
          : " overflow-hidden bg-stone-400 "
      } gap-[1%]`}
    >
      {user && <Navbar />}
      <Router />
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
