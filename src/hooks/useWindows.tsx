import React, { useMemo, useState } from "react";
import { mutateArray, mutateStateArray } from "@utils";
import { Window } from "@components";
import { siteSections } from "@content";
import { useResizeWindows } from "@hooks";

interface IWindowManager {
  content: JSX.Element[],
  handleNavClick: (name: string) => void;
}

/**
 * Handles all window-related logic: the names of the windows, what order they're in, what HTML elements correspond to them. Internally calls the useResizeWindows hook to enable window resizing, and returns an interface containing (a) the array of windows as JSX elements and (b) a function to set the active (focused) window.
 */
const useWindows = (): IWindowManager => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState<{ [key: string]: HTMLDivElement }>({});

  useResizeWindows(windowRefs);

  /**
   * Set a window as the active/focused window.
   * @param name the name of the window to focus
   */
  const setActiveWindow = (name: string): void => {
    if (!siteSections[name]) return; // if there's no site section by this name, do nothing
    const indexOfActiveWindow = windows.indexOf(name);
    if (indexOfActiveWindow < 0) { // if the window is open at all
      setWindows(mutateStateArray(array => array.push(name)));
    } else { // the window is open, just not active/focused
      const moveArrayElementToEnd = (array: any[], index: number) => {
        array.push(array.splice(index, 1)[0]);
      }
      setWindows(mutateStateArray(array => moveArrayElementToEnd(array, indexOfActiveWindow)));
    }
  }

  /**
   * Create the actual windows (JSX elements) to be rendered
   */
  const content = useMemo(() => {
    const createWindow = (name: string): JSX.Element => {
      /**
       * The createRef function to be passed in as ref
       * @param element the element to bind this React ref to
       */
      const createWindowRef = (element: HTMLDivElement): void => {
        setWindowRefs(prevObj => {
          if (prevObj[name]) {
            return prevObj;
          }
          const returnObj = {...prevObj};
          returnObj[name] = element;
          return returnObj;
        });
      }

      /**
       * Cleanup function for when this Window unmounts: remove element from windowRefs object
       */
      const removeWindowRef = (): void => {
        setWindowRefs(prevObj => {
          const objToReturn = {...prevObj};
          delete objToReturn[name];
          return objToReturn;
        });
      }

      /**
       * Close this window by removing it from the array
       */
      const closeWindow = (): void => {
        const index = windows.indexOf(name); // fixme! this should go inside the callback
        setWindows(mutateArray((array) => array.splice(index, 1)));
        removeWindowRef();
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
          windowRef={windowRefs[name]}
          registerRef={createWindowRef}
          destroyRef={removeWindowRef}
        />
      )
    }
    return windows.map(createWindow);
  }, [windows, windowRefs]);

  return {
    content,
    handleNavClick: setActiveWindow
  }
}

export default useWindows;