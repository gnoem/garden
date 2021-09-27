import React, { useEffect, useMemo, useState } from "react";

import { mutateArray } from "@utils";
import { Window } from "../components";
import * as siteSections from "@content/sections";

const getSection = (name: string) => siteSections[name.split(' ').join('')];

const useWindows = () => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState<{ [key: string]: HTMLDivElement | null }>({});
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  // when activeWindow changes, open up or switch focus to that window
  useEffect(() => {
    const showWindow = (name: string) => {
      if (!getSection(name)) return null;
      const windowIndex = windows.indexOf(name);
      if (windowIndex === -1) { // if not in array, add to top of array
        setWindows(mutateArray((array) => array.push(name)));
      } else { // else, move to last position in array (window z-index will correspond to index)
        const moveArrayElementToEnd = (array, index) => {
          array.push(array.splice(index, 1)[0]);
        }
        setWindows(mutateArray((array) => moveArrayElementToEnd(array, windowIndex)));
      }
    }

    if (activeWindow) {
      showWindow(activeWindow);
    }
  }, [activeWindow]);

  // anytime windowRefs changes, clean up any null windowRefs
  useEffect(() => {
    if (Object.values(windowRefs).includes(null)) {
      for (const key in windowRefs) {
        if (windowRefs[key] === null || windowRefs[key] === undefined) {
          delete windowRefs[key];
        }
      }
    }
  }, [Object.values(windowRefs)]);

  // make sure that activeWindow is consistent with the last element in windows array
  useEffect(() => {
    if (!activeWindow) return;
    if (!windows.includes(activeWindow)) {
      const lastIndex = windows.length - 1;
      setActiveWindow(windows[lastIndex]);
    }
  }, [windows]); // do NOT add activeWindow to dep array

  // create the actual windows
  const content = useMemo(() => {
    const createWindow = (name: string): JSX.Element | null => {

      const pageContent = getSection(name)?.content?.();
      if (!pageContent) return null;

      const createWindowRef = (element: HTMLDivElement): void => {
        setWindowRefs(prevObj => ({
          ...prevObj,
          [name]: element
        }));
      }

      const closeWindow = (): void => {
        // remove from array
        const index = windows.indexOf(name);
        setWindows(mutateArray((array) => array.splice(index, 1)));
        // delete ref
        setWindowRefs(prevObj => {
          const objToReturn = {...prevObj};
          delete objToReturn[name];
          return objToReturn;
        });
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
          registerRef={createWindowRef}>
            {pageContent}
        </Window>
      )
    }
    return windows.map(createWindow);
  }, [windows]);

  return {
    refs: windowRefs,
    content,
    handleNavClick: setActiveWindow
  }
}

export default useWindows;