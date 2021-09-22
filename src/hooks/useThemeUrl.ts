import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useThemeUrl = (themes: string[], fallbackId: number): [number, Dispatch<SetStateAction<number>>] => {
  const isValid = (themeId: any): boolean => themes.map((_, i) => i).includes(themeId); // e.g. [0, 1, 2, 3].includes(themeId);

  const hash = parseInt(window.location.hash.split('#')[1]);
  const [themeId, setThemeId] = useState<number>(isValid(hash) ? hash : fallbackId);

  useEffect(() => {
    if (!isValid(themeId)) {
      setThemeId(fallbackId);
      return;
    }
    window.location.hash = `#${themeId}`;
  }, [themeId]);

  return [themeId, setThemeId];
}

export default useThemeUrl;

/* 
first, get window.location.hash and put it in hashState
if window.location.hash is undefined, set hashState to fallbackId
if hashState is undefined/null (which it will be initially), prevent loading
  - where setLoading is called, wait until hashState != null
  - inside setLoading, first confirm that hashState != null before going through with it
  - have {
    objectsLoading: boolean;
    themeLoading: boolean;
  } instead of just loading or !loading to better register what parts of the page have loaded

"loading" isn't the most accurate term, it should really be more like "ready"
*/