import { randomIntBetween } from "@utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useThemeUrl = (themes: string[]): [number, Dispatch<SetStateAction<number>>] => {
  const isValid = (themeId: any): boolean => themes.map((_, i) => i).includes(themeId); // e.g. [0, 1, 2, 3].includes(themeFromUrl);

  const hash = parseInt(window.location.hash.split('#')[1]);
  const randomThemeId = randomIntBetween(0, themes.length);
  const [themeId, setThemeId] = useState<number>(isValid(hash) ? hash : randomThemeId);

  useEffect(() => {
    if (!isValid(themeId)) {
      setThemeId(randomThemeId);
      return;
    }
    window.location.hash = `#${themeId}`;
  }, [themeId]);

  return [themeId, setThemeId];
}

export default useThemeUrl;