import React, { useState } from "react";

import * as styles from "./window.module.css";
import { Icons } from "@components";
import { useDataPath, useDragonDrop } from "@hooks";
import { useRandomizeWindow, useTabs } from "./hooks";

interface IWindowProps {
  name: string;
  index: number;
  active: boolean;
  registerRef: (element: HTMLDivElement) => void;
  closeWindow: () => void;
  focusWindow: () => void;
  switchToWindow: (name: string) => void;
}

const Window: React.FC<IWindowProps> = ({ name, index, active, registerRef, focusWindow, switchToWindow, closeWindow, children }): JSX.Element => {
  const [localRef, setLocalRef] = useState<HTMLDivElement | undefined>(null);
  const { initDragonDrop } = useDragonDrop(localRef);
  useDataPath(localRef, createButton(switchToWindow));
  const ready = useRandomizeWindow(localRef);
  const { tabs, closeTab, activeTab, setActiveTab } = useTabs(name);
  const createWindowRef = (element) => {
    registerRef(element);
    setLocalRef(element);
  }
  const handleDivClick = (e) => {
    if (e.target.closest('button')) return;
    focusWindow();
  }
  return (
    <div
      className={`${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''}`}
      onMouseDown={handleDivClick}
      style={{ zIndex: index }}
      ref={createWindowRef}>
        <Bar>
          <div onMouseDown={initDragonDrop} onTouchStart={initDragonDrop}>
            <span>{name}</span>
            <div><button onMouseDown={closeWindow}><Icons.Times /></button></div>
          </div>
          {(tabs?.length > 1) && <Tabs {...{ tabs, closeTab, activeTab, setActiveTab }} />}
        </Bar>
        <Content>
          {children}
        </Content>
    </div>
  )
}

const Bar: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.Bar}>
      {children}
    </div>
  )
}

interface ITabsProps {
  tabs?: string[];
  closeTab: (string) => void;
  activeTab: string;
  setActiveTab: (string) => void;
}

const Tabs: React.FC<ITabsProps> = ({ tabs, closeTab, activeTab, setActiveTab }): JSX.Element => {
  return (
    <div className={styles.Tabs}>
      {tabs.map(tab => <Tab {...{ tab, closeTab, activeTab, setActiveTab }} />)}
    </div>
  )
}

interface ITabProps extends ITabsProps {
  tab: string;
}

const Tab: React.FC<ITabProps> = ({ tab, closeTab, activeTab, setActiveTab }): JSX.Element => {
  return (
    <div className={`${styles.Tab} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>
      {tab}
      <button onClick={() => closeTab(tab)}><Icons.Times /></button>
    </div>
  )
}

const Content: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.Content}>
      {children}
    </div>
  )
}

const createButton = (open) => (path) => {
  const link = document.createElement('button');
  link.setAttribute('data-link', path);
  link.className = 'glossy';
  link.innerHTML = path;
  link.onclick = () => open(path);
  return link;
}

export default Window;