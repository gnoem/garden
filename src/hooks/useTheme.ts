import { useEffect } from "react";
import { useThemeUrl } from "@hooks";
import { ISwitchTheme } from "@types";
import { randomIntBetween } from "@utils";

interface IThemeContext {
  fetchedTheme: boolean;
  activeTheme: string;
  switchTheme: ISwitchTheme;
}

const themes = ['oracle', 'donttouch', 'handlewithcare'];
const enableKeyboardNav = false;

/**
 * Handles all theme-related logic, theme switching and URL routing
 * @param setLoading the setState function that controls app loading state
 * @returns theme management interface
 */
const useTheme = (setLoading: (value: boolean) => void): IThemeContext => {
  const randomThemeId = randomIntBetween(0, themes.length);
  const [activeTheme, setActiveTheme] = useThemeUrl(themes, randomThemeId);

  /**
   * Theme switch wrapper to prevent flickering — first dim the canvas, THEN change the theme. (Canvas will un-dim itself when all the objects in the scene have loaded.)
   * @param fn the setActiveTheme function to wrap
   */
  const fade = (fn: () => void): void => {
    setLoading(true);
    setTimeout(fn, 250);
  }

  /**
   * Controller for switching themes
   * Three methods: next(), previous(), and to()
   */
  const switchTheme = {
    next: () => {
      fade(() => setActiveTheme(num => (num == null) ? null : ((num < themes.length - 1) ? num + 1 : 0)));
    },
    previous: () => {
      fade(() => setActiveTheme(num => (num == null) ? null : ((num === 0) ? themes.length - 1 : num - 1)));
    },
    to: (num: number) => {
      fade(() => setActiveTheme(num));
    }
  }

  /**
   * Enables arrow keys to cycle through themes
   */
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
    fetchedTheme: activeTheme !== null,
    activeTheme: themes[activeTheme ?? randomThemeId] ?? themes[randomThemeId],
    switchTheme
  }
}

export default useTheme;