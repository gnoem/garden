import React, { useMemo, useState } from "react";
import { mutateArray, mutateStateArray } from "@utils";
import { Window } from "@components";
import { siteSections } from "@content";
import { useResizeWindows } from "@hooks";

const useWindows = () => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState<{ [key: string]: HTMLDivElement }>({});

  useResizeWindows(windowRefs);

  const setActiveWindow = (name: string): void => {
    if (!siteSections[name]) return;
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

  // create the actual windows
  const content = useMemo(() => {
    const createWindow = (name: string): JSX.Element | null => {

      const pageContent = siteSections[name]?.content?.();
      if (!pageContent) return null;

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

      // cleanup function for when this Window unmounts - remove element from windowRefs
      const removeWindowRef = (): void => {
        setWindowRefs(prevObj => {
          const objToReturn = {...prevObj};
          delete objToReturn[name];
          return objToReturn;
        });
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
          windowRef={windowRefs[name]}
          registerRef={createWindowRef}
          destroyRef={removeWindowRef}>
            {pageContent}
        </Window>
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