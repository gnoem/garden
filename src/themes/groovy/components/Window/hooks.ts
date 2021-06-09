import { mutateArray, randomIntBetween } from "@utils";
import { useEffect, useState } from "react";

export const useRandomizeWindow = (localRef) => {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    /* set random size/position of window */
    if (!localRef) return;
    const setWindowSize = () => {
      const isMobile = window.innerWidth < 600;
      const width = isMobile
        ? randomIntBetween(window.innerWidth * 0.75, window.innerWidth * 0.9)
        : randomIntBetween(350, 600);
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
      localRef.style.width = `${width}px`;
      localRef.style.height = `${height}px`;
      localRef.style.transform = `translate3d(${randomX}px, ${randomY}px, 0)`;
      setReady(true);
    }
    if (!ready) {
      setWindowSize();
    }
  }, [localRef]);
  return ready;
}

export const useTabs = (baseTab) => {
  const [tabs, setTabs] = useState<string[]>([baseTab, 'tab 2', 'tab 3']);
  const [activeTab, setActiveTab] = useState<string>(baseTab);
  const closeTab = (tab) => {
    setTabs(mutateArray((array) => array.splice(array.indexOf(tab), 1)));
  }
  return {
    tabs, setTabs, closeTab,
    activeTab, setActiveTab
  }
}