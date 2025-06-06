"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  activeView: string;
  setActiveView: (__view: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState("contacts");

  return (
    <NavigationContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};
