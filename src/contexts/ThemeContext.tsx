import { IThemeContext } from "@types";
import React, { useState } from "react";

export const ThemeContext = React.createContext<IThemeContext>(null);

export const ThemeContextProvider: React.FC = ({ children }): JSX.Element => {
  const [activeTheme, setActiveTheme] = useState<string>('oracle');
  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}