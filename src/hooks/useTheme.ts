import { IThemeContext } from "@types";
import { useEffect, useState } from "react";

const themes: string[] = ['oracle', 'crystal', 'donttouch'];

const useTheme = (canvas: HTMLCanvasElement, setLoading: any): IThemeContext => {
  const [activeTheme, setActiveTheme] = useState<number>(0);

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
  }, [activeTheme, canvas]);

  return {
    activeTheme: themes[activeTheme]
  }
}

export default useTheme;