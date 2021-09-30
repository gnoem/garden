import { useCallback, useEffect, useState } from "react";
import { mutateArray } from "@utils";
import { ITab } from "@types";

interface ITabData {
  tabs: ITab[];
  openTab: (tabName: string) => void;
  closeTab: (tabName: string) => void;
  activeTab: ITab;
  setActiveTab: (tab: ITab) => void;
}

/**
 * Used inside Window component to handle tab management — which tabs exist, which one is active/focused, how much each one is scrolled — and expose methods for easy opening/closing/switching of tabs
 * @param defaultTabs the default/starting tabs for this window
 * @returns tab management interface
 */
const useTabs = (defaultTabs: ITab[]): ITabData => {
  const [openInBackground, setOpenInBackground] = useState<boolean>(false);
  const [tabs, setTabs] = useState<ITab[]>(defaultTabs);
  const [justOpened, setJustOpened] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ITab>(defaultTabs[0]);

  /**
   * remove this tab from the tabs array
   * if this tab is currently the active tab, find the tab that's "next in line" and switch to it
   */
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

  /**
   * Sets the justOpened state, which triggers the useEffect responsible for actually opening/switching to a tab
   * @param tabName the name of the tab to open
   */
  const openTab = (tabName: string) => setJustOpened(tabName);

  /**
   * Actually open up the "just opened" tab
   * Save the amount scrolled of the current active tab
   * Open up or switch to the justOpened tab
   */
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

    // if tab is open in the background/not currently active:
    if (tabs.some(tab => tab.name === justOpened)) {
      const foundTab = tabs.find(tab => tab.name === justOpened);
      const amountScrolled = foundTab?.scrolled ?? null;
      setActiveTab({ name: justOpened, scrolled: amountScrolled });
    } else { // opening new tab
      setTabs(mutateArray((array: ITab[]) => array.push({ name: justOpened, scrolled: 0 })));
      if (!openInBackground) setActiveTab({ name: justOpened, scrolled: 0 });
    }
    setJustOpened(null);

  }, [openInBackground, justOpened]);

  /**
   * Add keydown/keyup listeners to enable "quietly" opening up a tab by holding down the meta (ctrl/command) key
   */
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