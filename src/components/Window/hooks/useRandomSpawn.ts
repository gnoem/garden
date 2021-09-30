import { useEffect, useState } from "react";
import { randomNumberBetween } from "@utils";

/**
 * Randomly sets a window's size and translation when it is launched. Returns true when set.
 */
const useRandomSpawn = (windowRef: HTMLDivElement | null): boolean => {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!windowRef) return;
    const setWindowSize = () => {
      const isMobile = window.innerWidth < 600;
      let { minWidth = 350 } = windowRef.dataset;
      minWidth = (typeof minWidth === 'string') ? parseInt(minWidth) : minWidth;
      const width = isMobile
        ? randomNumberBetween(window.innerWidth * 0.75, window.innerWidth * 0.9)
        : randomNumberBetween(minWidth, 600);
      const height = isMobile
        ? randomNumberBetween(Math.round(width * 0.8), Math.round(width * 1.3))
        : randomNumberBetween(Math.round(width * 0.5), Math.round(width * 0.8));
      // todo remember to readjust if window resizes, dont want elements getting cut off
      const randomX = isMobile
        ? randomNumberBetween(5, window.innerWidth - (width + 5))
        : randomNumberBetween(20, window.innerWidth - (width + (window.innerWidth * 0.1)));
      const randomY = isMobile
        ? randomNumberBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)))
        : randomNumberBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)));
      windowRef.style.width = `${width}px`;
      windowRef.style.height = `${height}px`;
      windowRef.style.transform = `translate3d(${randomX}px, ${randomY}px, 0)`;
      setReady(true);
    }
    if (!ready) {
      setWindowSize();
    }
  }, [windowRef]);
  return ready;
}

export default useRandomSpawn;