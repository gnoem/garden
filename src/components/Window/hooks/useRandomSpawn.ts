import { useEffect, useState } from "react";
import { randomIntBetween } from "@utils";

/*
set random size/position of window and return true when done
*/

const useRandomSpawn = (windowRef: HTMLDivElement | null): boolean => {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!windowRef) return;
    const setWindowSize = () => {
      const isMobile = window.innerWidth < 600;
      const { minWidth = 350 } = windowRef.dataset;
      const width = isMobile
        ? randomIntBetween(window.innerWidth * 0.75, window.innerWidth * 0.9)
        : randomIntBetween(minWidth, 600);
      const height = isMobile
        ? randomIntBetween(Math.round(width * 0.8), Math.round(width * 1.3))
        : randomIntBetween(Math.round(width * 0.5), Math.round(width * 0.8));
      // todo remember to readjust if window resizes, dont want elements getting cut off
      const randomX = isMobile
        ? randomIntBetween(5, window.innerWidth - (width + 5))
        : randomIntBetween(20, window.innerWidth - (width + (window.innerWidth * 0.1)));
      const randomY = isMobile
        ? randomIntBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)))
        : randomIntBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)));
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