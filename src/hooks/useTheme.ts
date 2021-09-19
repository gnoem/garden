import { useEffect } from "react";
import { useThemeUrl } from "@hooks";
import { IThemeContext } from "@types";

const themes = ['oracle', 'donttouch', 'handlewithcare'];

const useTheme = (setLoading: any): IThemeContext => {
  const [activeTheme, setActiveTheme] = useThemeUrl(themes);

  const fade = (fn) => {
    // whenever theme is toggled, FIRST dim the canvas, THEN change the theme to prevent flicker
    setLoading(true);
    setTimeout(fn, 250);
  }

  const switchTheme = {
    next: () => {
      fade(() => setActiveTheme(num => (num < themes.length - 1) ? num + 1 : 0));
    },
    previous: () => {
      fade(() => setActiveTheme(num => (num === 0) ? themes.length - 1 : num - 1));
    },
    to: (num: number) => {
      fade(() => setActiveTheme(num));
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowRight': {
          switchTheme.next();
          break;
        }
        case 'ArrowLeft': {
          switchTheme.previous();
          break;
        }
        default: null
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTheme]);

  return {
    activeTheme: themes[activeTheme] ?? themes[0],
    switchTheme
  }
}

export default useTheme;