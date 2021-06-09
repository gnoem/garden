import { mutateArray, randomIntBetween } from "@utils";
import { useCallback, useEffect, useState } from "react";

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
  const [openInBackground, setOpenInBackground] = useState<boolean>(false);
  const [tabs, setTabs] = useState<string[]>([baseTab]);
  const [justOpened, setJustOpened] = useState<string>(null);
  // ^^ workaround to allow tabs to open in the background; openTab function is called from Tab component which doesn't have access to the latest openInBackground state, so openInBackground is always false inside openTab :(  todo see if there's a better way
  const [activeTab, setActiveTab] = useState<string>(baseTab);
  const closeTab = useCallback((tab) => {
    if (tab === activeTab) {
      const index = tabs.indexOf(tab);
      const nextInLine = tabs[index + 1] ?? tabs[index - 1] ?? baseTab;
      setActiveTab(nextInLine);
    }
    setTabs(mutateArray((array) => {
      const index = array.indexOf(tab);
      return array.splice(index, 1);
    }));
  }, [activeTab, tabs]);
  const openTab = (tab) => {
    if (tabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setTabs(mutateArray((array) => array.push(tab)));
      setJustOpened(tab);
    }
  }
  useEffect(() => {
    if (!justOpened) return;
    if (!openInBackground) {
      setActiveTab(justOpened);
    }
    setJustOpened(null);
  }, [openInBackground, justOpened]);
  useEffect(() => {
    // todo double check this isnt causing bugs if multiple useTabs <Window>s are onscreen
    const handleKeydown = (e) => {
      if (e.key === 'Meta') setOpenInBackground(true);
    }
    const handleKeyup = (e) => {
      if (e.key === 'Meta') setOpenInBackground(false);
    }
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
    }
  }, []);
  return {
    tabs, openTab, closeTab,
    activeTab, setActiveTab
  }
}