import { IThemeContext } from "@types";
import { useEffect, useState } from "react";

const themes: string[] = ['oracle', 'crystal', 'donttouch'];

const useTheme = (): IThemeContext => {
  const [activeTheme, setActiveTheme] = useState<number>(0);

  const navigate = {
    next: () => setActiveTheme(num => (num < themes.length - 1) ? num + 1 : 0),
    previous: () => setActiveTheme(num => (num === 0) ? themes.length - 1 : num - 1)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowRight': {
          navigate.next();
          break;
        }
        case 'ArrowLeft': {
          navigate.previous();
          break;
        }
        default: null
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTheme]);

  return {
    activeTheme: themes[activeTheme]
  }
}

export default useTheme;