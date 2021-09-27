import { useRef, useState } from "react";

interface IMinimizeWindowTools {
  minimized: boolean;
  windowMaxHeight: number | null;
  toggleMinimized: () => void;
}

const useMinimizeWindows = (
  active: boolean,
  focusWindow: () => void,
  { windowRef, titleBarRef }: { [key: string]: HTMLDivElement | null }
): IMinimizeWindowTools => {
  const [maxHeight, setMaxHeight] = useState<{ minimized: boolean; value: number | null }>({ minimized: false, value: null });
  const prevMaxHeight = useRef<number | null>(null);
  
  const toggleMinimized = (): void => {
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