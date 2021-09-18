import { IThemeContext } from "@types";
import { randomIntBetween } from "@utils";
import { useEffect } from "react";
import { useQueryParam, NumberParam } from "use-query-params";

const themes = ['oracle', 'donttouch', 'handlewithcare'];

const useTheme = (setLoading: any): IThemeContext => {
  const [themeFromUrl, setThemeFromUrl] = useQueryParam('t', NumberParam);
  const randomTheme = randomIntBetween(0, themes.length);
  const activeTheme = themeFromUrl ?? randomTheme;

  useEffect(() => {
    if (themeFromUrl == null) {
      setThemeFromUrl(activeTheme);
      return;
    }
    const themeFromUrlIsValid = themes.map((_, i) => i).includes(themeFromUrl); // e.g. [0, 1, 2, 3].includes(themeFromUrl);
    if (!themeFromUrlIsValid) {
      setThemeFromUrl(randomTheme);
    }
  }, [themeFromUrl]);

  const fade = (fn) => {
    // whenever theme is toggled, FIRST dim the canvas, THEN change the theme to prevent flicker
    setLoading(true);
    setTimeout(fn, 250);
  }

  const switchTheme = {
    next: () => {
      fade(() => setThemeFromUrl(num => (num < themes.length - 1) ? num + 1 : 0));
    },
    previous: () => {
      fade(() => setThemeFromUrl(num => (num === 0) ? themes.length - 1 : num - 1));
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
    activeTheme: themes[activeTheme] ?? themes[randomTheme],
    switchTheme
  }
}

export default useTheme;