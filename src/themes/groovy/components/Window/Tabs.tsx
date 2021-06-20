import React from "react";

import * as styles from "./window.module.css";
import { ITab } from "./hooks";
import { Icons } from "@components";
import { pageConfig } from "@config";

interface ITabsProps {
  name?: string;
  tabs?: { name: string; scrolled: number }[];
  openTab: (string) => void;
  closeTab: (string) => void;
  activeTab: ITab;
}

const Tabs: React.FC<ITabsProps> = ({ name, tabs, openTab, closeTab, activeTab }): JSX.Element => {
  if (tabs?.length <= 1) return null;
  return (
    <div className={styles.Tabs}>
      {tabs.map(tab => <Tab {...{ name, tab, openTab, closeTab, activeTab }} />)}
    </div>
  )
}

interface ITabProps extends ITabsProps {
  tab: ITab;
}

const Tab: React.FC<ITabProps> = ({ name, tab, openTab, closeTab, activeTab }): JSX.Element => {
  const handleTabClick = (e) => {
    if (e.target.closest('button')) return;
    if (activeTab.name === tab.name) return;
    openTab(tab.name);
  }
  return (
    <div key={tab.name} className={`${styles.Tab} ${activeTab.name === tab.name ? styles.active : ''}`} onClick={handleTabClick}>
      {pageConfig[tab.name]?.title ?? tab.name}
      {(tab.name !== name) && <button onClick={() => closeTab(tab.name)}><Icons.Times /></button>}
    </div>
  )
}

export default Tabs;