import { ITab } from "@types";
import { newArrayFrom } from "@utils";
import { useEffect, useMemo, useState } from "react";

interface ITabInfo {
  tabs: ITab[];
  activeTab: ITab;
  openTab: (tabName: string) => void;
  closeTab: (tabName: string) => void;
  saveScrollPosition: (scrolled: number) => void;
}

const useTabs = (baseTabName: string): ITabInfo => {
  const baseTab = useMemo<ITab>(() => ({
    name: baseTabName,
    scrolled: 0,
    active: true
  }), [baseTabName]);

  const [tabs, setTabs] = useState<ITab[]>([baseTab]);
  const [openInBackground, setOpenInBackground] = useState<boolean>(false);

  const getActiveTabIndex = (tabArray = tabs) => tabArray.findIndex(tab => tab.active === true);
  const activeTab = useMemo<ITab>(() => {
    return tabs[getActiveTabIndex()];
  }, [tabs]);

  /**
   * Find a tab by name and open it up
   * @param tabName the name of the target tab
   */
  const openTab = (tabName: string): void => {
    setTabs(newArrayFrom<ITab>(tabs => {
      const currentTabIndex = getActiveTabIndex(tabs);
      const targetTabIndex = tabs.findIndex(tab => tab.name === tabName);
      const currentTab = tabs[currentTabIndex];
      if (currentTabIndex === targetTabIndex) return;
      // if targetTab is already in tabs array (just not active/focused), set targetTab.active to true:
      if (targetTabIndex >= 0) {
        currentTab.active = false;
        tabs[targetTabIndex].active = true;
      } else { // otherwise, push it to tabs array
        const newTab = {
          name: tabName,
          scrolled: 0,
          active: !openInBackground
        }
        if (!openInBackground) {
          currentTab.active = false;
        }
        tabs.push(newTab);
      }
    }));
  }

  /**
   * Find a tab by name and close it
   * @param tabName the name of the target tab
   */
  const closeTab = (tabName: string): void => {
    setTabs(newArrayFrom<ITab>(tabs => {
      const activeTab = tabs[getActiveTabIndex(tabs)];
      if (!activeTab) return;
      const targetTabIndex = tabs.findIndex(tab => tab.name === tabName);
      const targetIsActive = tabName === activeTab.name;
      if (targetIsActive) { // if the tab we want to close is the currently active tab
        const nextInLine = tabs[targetTabIndex + 1] ?? tabs[targetTabIndex - 1] ?? tabs[0];
        const nextInLineIndex = tabs.findIndex(tab => tab.name === nextInLine.name);
        tabs[nextInLineIndex].active = true;
      }
      tabs.splice(targetTabIndex, 1);
    }));
  }

  /**
   * Save the scroll position of the active tab
   * @param scrolled the amount scrolled downwards, in pixels
   */
  const saveScrollPosition = (scrolled: number): void => {
    setTabs(newArrayFrom<ITab>(tabs => {
      const activeTab = tabs[getActiveTabIndex(tabs)];
      activeTab.scrolled = scrolled;
    }));
  }

  /**
   * useEffect prevents:
   * • accidentally emptying the tabs array
   * • none of the tabs being active
   */
  useEffect(() => {
    if (tabs.length === 0) { // if tabs is empty, push baseTab
      setTabs(newArrayFrom<ITab>(tabs => {
        tabs.push(baseTab);
      }));
      return;
    }
    if (!activeTab) { // if no active tab can be found, make the first one active
      setTabs(newArrayFrom<ITab>(tabs => {
        tabs[0].active = true; // we know that tabs[0] is defined because we already handled the empty array case above
      }));
    }
  }, [tabs, baseTab]);

  /**
   * Add keydown/keyup listeners to enable "quietly" opening up tabs by holding down Ctrl/Cmd
   */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        setOpenInBackground(true);
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        setOpenInBackground(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  }, []);

  return {
    tabs,
    activeTab,
    openTab,
    closeTab,
    saveScrollPosition
  }
}

export default useTabs;