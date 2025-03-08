import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
} 