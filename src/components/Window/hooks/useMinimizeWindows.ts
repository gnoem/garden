import { useRef, useState } from "react";

interface IMinimizeWindowManager {
  minimized: boolean;
  windowMaxHeight: number | null;
  toggleMinimized: () => void;
}

/**
 * Manages all logic relating to a given window's minimized/unminimized state.
 * @param active this window's active state
 * @param focusWindow the function to focus this window
 * @param param2 the window ref and title bar ref
 * @returns interface to manage this window's minimized/unminimized state
 */
const useMinimizeWindows = (
  active: boolean,
  focusWindow: () => void,
  { windowRef, titleBarRef }: { [key: string]: HTMLDivElement | null }
): IMinimizeWindowManager => {
  const [maxHeight, setMaxHeight] = useState<{ minimized: boolean; value: number | null }>({ minimized: false, value: null });
  const prevMaxHeight = useRef<number | null>(null);
  
  const toggleMinimized = () => {
    if (!(windowRef && titleBarRef)) return;
    if (maxHeight.minimized) {
      if (!active) focusWindow();
      setTimeout(() => {
        setMaxHeight({
          minimized: false,
          value: prevMaxHeight.current
        });
        setTimeout(() => {
          windowRef.style.maxHeight = '';
        }, 200); // transition duration
      }, active ? 0 : 10); // for some reason, if also focusing window, max height transition doesn't work without timeout
    } else {
      // get current height of window and store in ref
      const { height: currentHeight } = windowRef.getBoundingClientRect();
      prevMaxHeight.current = currentHeight;
      windowRef.style.maxHeight = `${currentHeight}px`;
      setTimeout(() => {
        setMaxHeight({
          minimized: true,
          value: titleBarRef.getBoundingClientRect().height
        });
      }, 10);
    }
  }

  return {
    minimized: maxHeight.minimized,
    windowMaxHeight: maxHeight.value,
    toggleMinimized
  }
}

export default useMinimizeWindows;