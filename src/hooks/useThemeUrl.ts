import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * Returns the themeId of the active theme, and a function to update it
 * @param themes array of theme names
 * @param fallbackId index of theme to use as a fallback in case themeId is ever invalid
 * @returns [themeId, setThemeId]
 */
const useThemeUrl = (themes: string[], fallbackId: number): [number | null, Dispatch<SetStateAction<number | null>>] => {
  const isValid = (themeId: any): boolean => themes.map((_, i) => i).includes(themeId); // e.g. [0, 1, 2, 3].includes(themeId);

  const [fetchedHash, setFetchedHash] = useState<boolean>(false);
  const [themeId, setThemeId] = useState<number | null>(null);
  
  /**
   * On first render, set the themeId based on the URL hash (if valid) and then mark down that we've fetched the hash from URL
   * Here to prevent SSR error where "window" is undefined
   */
  useEffect(() => {
    const hash = parseInt(window.location.hash.split('#')[1]);
    setThemeId(isValid(hash) ? hash : fallbackId);
    setFetchedHash(true);
  }, []);

  /**
   * runs whenever themeId changes
   * make sure the themeId is valid and setThemeId to fallbackId if not; otherwise, update window.location.hash to keep the URL in sync with the current theme
   * does nothing if we haven't already fetched the URL hash (otherwise themeId would be invalid and trigger the fallback theme before we've even grabbed the URL hash!)
   */
  useEffect(() => {
    if (!fetchedHash) return;
    if (!isValid(themeId)) {
      setThemeId(fallbackId);
      return;
    }
    window.location.hash = `#${themeId}`;
  }, [themeId]);

  return [themeId, setThemeId];
}

export default useThemeUrl;