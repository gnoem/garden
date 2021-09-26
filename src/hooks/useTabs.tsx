import { useCallback, useEffect, useState } from "react";
import { mutateArray } from "@utils";
import { ITab } from "@types";

const useTabs = (defaultTabs: ITab[]) => {
  const [openInBackground, setOpenInBackground] = useState<boolean>(false);
  const [tabs, setTabs] = useState<ITab[]>(defaultTabs);
  const [justOpened, setJustOpened] = useState<string | null>(null);
  // ^^ workaround for openTab function to work properly - openTab is called directly from the Tab component which doesn't have access to the latest tabs and openInBackground state :( todo see if there's a better way
  const [activeTab, setActiveTab] = useState<ITab>(defaultTabs[0]);
  const closeTab = useCallback((tabName: string) => {
    if (tabName === activeTab.name) {
      const index = tabs.findIndex((tab: ITab) => tab.name === tabName);
      const nextInLine = tabs[index + 1] ?? tabs[index - 1] ?? defaultTabs[0];
      setActiveTab(nextInLine);
    }
    setTabs(mutateArray((array: ITab[]) => {
      const index = array.findIndex((tab: ITab) => tab.name === tabName);
      return array.splice(index, 1);
    }));
  }, [activeTab, tabs]);
  const openTab = (tabName: string) => setJustOpened(tabName); // will trigger useEffect which has access to the most recent tabs/openInBackground state
  useEffect(() => {
    if (!justOpened) return;
    // first save scrollTop of current activeTab in tabs array
    const savePrevTabScroll = () => {
      // find entry in tabs and mutate
      const updatedPrevTab = {...activeTab};
      setTabs(mutateArray((array: ITab[]) => {
        const prevTabIndex = array.findIndex((tab: ITab) => tab.name === activeTab.name);
        return array.splice(prevTabIndex, 1, updatedPrevTab);
      }));
    }
    savePrevTabScroll();
    if (tabs.some((tab: ITab) => tab.name === justOpened)) { // if tab is open in the background/not currently active
      const foundTab = tabs.find((tab: ITab) => tab.name === justOpened);
      const amountScrolled = foundTab?.scrolled ?? null;
      setActiveTab({ name: justOpened, scrolled: amountScrolled });
    } else { // opening new tab
      setTabs(mutateArray((array: ITab[]) => array.push({ name: justOpened, scrolled: 0 })));
      if (!openInBackground) setActiveTab({ name: justOpened, scrolled: 0 });
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

export default useTabs;