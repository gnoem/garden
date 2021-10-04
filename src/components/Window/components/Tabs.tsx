import React from "react";
import * as styles from "../window.module.css";
import { Icons } from "@components";
import { siteSections } from "@content";
import { ITab } from "@types";

interface ITabsProps {
  name: string;
  tabs: ITab[];
  activeTab: ITab;
  openTab: (tabName: string) => void;
  closeTab: (tabName: string) => void;
}

const Tabs: React.FC<ITabsProps> = ({ name, tabs, activeTab, openTab, closeTab }): JSX.Element | null => {
  if (tabs.length <= 1) return null;

  const loadTab = (tab: ITab): JSX.Element => (
    <Tab {...{
      key: tab.name,
      name,
      tab,
      openTab,
      closeTab,
      activeTab
    }} />
  )

  return (
    <div className={styles.Tabs}>
      {tabs.map(loadTab)}
    </div>
  )
}

interface ITabProps extends ITabsProps {
  tab: ITab;
}

const Tab: React.FC<Omit<ITabProps, 'tabs'>> = ({ name, tab, openTab, closeTab, activeTab }): JSX.Element => {
  const handleTabClick = (e) => {
    if (e.target.closest('button')) return;
    if (activeTab.name === tab.name) return;
    openTab(tab.name);
  }
  
  return (
    <div className={`${styles.Tab} ${activeTab.name === tab.name ? styles.active : ''}`} onClick={handleTabClick}>
      {siteSections[tab.name]?.title ?? tab.name}
      {(tab.name !== name) && <button onClick={() => closeTab(tab.name)}><Icons.Times /></button>}
    </div>
  )
}

export default Tabs;