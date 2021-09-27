import React, { useEffect, useMemo, useState } from "react";

import { mutateArray, mutateStateArray } from "@utils";
import { Window } from "../components";
import * as siteSections from "@content/sections";

const getSection = (name: string) => siteSections[name.split(' ').join('')];

const useWindows = () => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState<{ [key: string]: HTMLDivElement | null }>({});
  // why do these have to be possibly null? can't we create a cleanup function for each window and pass it in as a prop to return in useEffect

  const setActiveWindow = (name: string): void => {
    if (!getSection(name)) return;
    const indexOfActiveWindow = windows.indexOf(name);
    if (indexOfActiveWindow < 0) {
      setWindows(mutateStateArray(array => array.push(name)));
    } else {
      const moveArrayElementToEnd = (array, index) => {
        array.push(array.splice(index, 1)[0]);
      }
      setWindows(mutateStateArray(array => moveArrayElementToEnd(array, indexOfActiveWindow)));
    }
  }

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