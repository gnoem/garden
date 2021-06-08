import React, { useEffect, useMemo, useState } from "react";

import { pageConfig } from "@config";
import { mutateArray } from "@utils";
import { Window } from "../components";

const useWindows = () => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState<{ [key: string]: HTMLDivElement }>({});
  const [activeWindow, setActiveWindow] = useState<string | undefined>(null);
  useEffect(() => {
    const showWindow = (name) => {
      // if not in array, add to top of array
      // if in array, move to last position in array (window z-index will correspond to index)
      if (!pageConfig[name]) return null;
      const windowIndex = windows.indexOf(name);
      if (windowIndex === -1) {
        setWindows(mutateArray((array) => array.push(name)));
      } else {
        const moveArrayElementToEnd = (array, index) => {
          array.push(array.splice(index, 1)[0]);
        }
        setWindows(mutateArray((array) => moveArrayElementToEnd(array, windowIndex)));
      }
    }
    showWindow(activeWindow);
  }, [activeWindow]);
  useEffect(() => {
    // clear null values from windows array + windowsRef object
    if (windows.includes(null)) {
      setWindows(mutateArray((array) => array.filter(el => el)));
    }
    if (Object.values(windowRefs).includes(null)) {
      const cleanObject = (obj) => {
        for (const key in obj) {
          if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
          }
        }
        return obj;
      }
      cleanObject(windowRefs);
    }
  }, [windows, windowRefs]);
  useEffect(() => {
    if (!windows.includes(activeWindow)) {
      const lastIndex = windows.length - 1;
      setActiveWindow(windows[lastIndex]);
    }
  }, [windows]); // do NOT add activeWindow to dep array
  const content = useMemo(() => {
    return windows.map(name => {
      const pageContent = pageConfig[name];
      if (!pageContent) return null;
      const createWindowRef = (element) => {
        setWindowRefs(prevObj => ({
          ...prevObj,
          [name]: element
        }));
      }
      const closeWindow = () => {
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
    });
  }, [windows]);
  return { refs: windowRefs, content, handleNavClick: setActiveWindow }
}

export default useWindows;