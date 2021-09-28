import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useThemeUrl = (themes: string[], fallbackId: number): [number | null, Dispatch<SetStateAction<number | null>>] => {
  const isValid = (themeId: any): boolean => themes.map((_, i) => i).includes(themeId); // e.g. [0, 1, 2, 3].includes(themeId);

  const [fetchedHash, setFetchedHash] = useState<boolean>(false);
  const [themeId, setThemeId] = useState<number | null>(null);
  
  useEffect(() => {
    const hash = parseInt(window.location.hash.split('#')[1]);
    setThemeId(isValid(hash) ? hash : fallbackId);
    setFetchedHash(true);
  }, []);

  useEffect(() => {
    if (!fetchedHash) return;
    if (!isValid(themeId)) {
      console.log(`${themeId} is not valid`);
      setThemeId(fallbackId);
      return;
    }
    window.location.hash = `#${themeId}`;
  }, [themeId]);

  return [themeId, setThemeId];
}

export default useThemeUrl;