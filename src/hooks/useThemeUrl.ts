import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useThemeUrl = (themes: string[], fallbackId: number): [number, Dispatch<SetStateAction<number>>] => {
  const isValid = (themeId: any): boolean => themes.map((_, i) => i).includes(themeId); // e.g. [0, 1, 2, 3].includes(themeFromUrl);

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