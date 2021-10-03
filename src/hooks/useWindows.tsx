import React, { useMemo, useState } from "react";
import { newArrayFrom } from "@utils";
import { Window } from "@components";
import { siteSections } from "@content";

interface IWindowManager {
  content: JSX.Element[],
  handleNavClick: (name: string) => void;
}

/**
 * Handles all window-related logic — the names of the windows, what order they're in — and returns an interface containing (a) the array of windows as JSX elements and (b) a function to set the active (focused) window.
 */
const useWindows = (): IWindowManager => {
  const [windows, setWindows] = useState<string[]>([]);

  /**
   * Set a window as the active/focused window.
   * @param name the name of the window to focus
   */
  const setActiveWindow = (name: string): void => {
    if (!siteSections[name]) return; // if there's no site section by this name, do nothing
    setWindows(newArrayFrom(windows => {
      const indexOfActiveWindow = windows.indexOf(name);
      if (indexOfActiveWindow >= 0) { // if the window is open and we just need to switch to it/focus it
        const moveArrayElementToEnd = (array: any[], index: number) => {
          array.push(array.splice(index, 1)[0]);
        }
        moveArrayElementToEnd(windows, indexOfActiveWindow);
      } else { // we need to actually open the window
        windows.push(name);
      }
    }));
  }

  /**
   * Create the actual windows (JSX elements) to be rendered
   */
  const content = useMemo(() => {
    const createWindow = (name: string): JSX.Element => {
      const closeWindow = (): void => {
        setWindows(newArrayFrom(array => {
          const index = array.indexOf(name);
          return array.splice(index, 1);
        }));
      }

      const index = windows.indexOf(name);
      
      return (
        <Window
          key={name}
          name={name}
          index={index}
          active={index === windows.length - 1}
          closeWindow={closeWindow}
          focusWindow={() => setActiveWindow(name)}
          switchToWindow={setActiveWindow}
        />
      )
    }
    return windows.map(createWindow);
  }, [windows]);

  return {
    content,
    handleNavClick: setActiveWindow
  }
}

export default useWindows;