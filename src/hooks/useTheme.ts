import { useEffect } from "react";
import { useThemeUrl } from "@hooks";
import { ISwitchTheme } from "@types";
import { randomIntBetween } from "@utils";

interface IThemeContext {
  activeTheme: string;
  switchTheme: ISwitchTheme
}

const themes = ['oracle', 'donttouch', 'handlewithcare'];
const enableKeyboardNav = false;

const useTheme = (setLoading: any): IThemeContext => {
  const randomThemeId = randomIntBetween(0, themes.length);
  const [activeTheme, setActiveTheme] = useThemeUrl(themes, randomThemeId);

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
    if (!enableKeyboardNav) return;
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
    activeTheme: themes[activeTheme] ?? themes[randomThemeId],
    switchTheme
  }
}

export default useTheme;