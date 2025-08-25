import { createContext, useContext } from "react";

interface NavContextProps {
  isOpen: boolean;
  toggle: () => void;
}

export const NavContext = createContext<NavContextProps | undefined>(undefined);

export function useNav() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav deve ser usado dentro de um NavProvider");
  }
  return context;
}
