import React from "react";

import * as styles from "./window.module.css";
import { Icons } from "@components";

interface ITabsProps {
  name?: string;
  tabs?: string[];
  closeTab: (string) => void;
  activeTab: string;
  setActiveTab: (string) => void;
}

const Tabs: React.FC<ITabsProps> = ({ name, tabs, closeTab, activeTab, setActiveTab }): JSX.Element => {
  if (tabs?.length <= 1) return null;
  return (
    <div className={styles.Tabs}>
      {tabs.map(tab => <Tab {...{ name, tab, closeTab, activeTab, setActiveTab }} />)}
    </div>
  )
}

interface ITabProps extends ITabsProps {
  tab: string;
}

const Tab: React.FC<ITabProps> = ({ name, tab, closeTab, activeTab, setActiveTab }): JSX.Element => {
  const handleTabClick = (e) => {
    if (e.target.closest('button')) return;
    setActiveTab(tab);
  }
  return (
    <div className={`${styles.Tab} ${activeTab === tab ? styles.active : ''}`} onClick={handleTabClick}>
      {tab}
      {(tab !== name) && <button onClick={() => closeTab(tab)}><Icons.Times /></button>}
    </div>
  )
}

export default Tabs;