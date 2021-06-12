import React, { useState } from "react";

import * as styles from "./window.module.css";
import { Icons } from "@components";
import { useDataPath, useDataTab, useDragonDrop } from "@hooks";
import { useRandomizeWindow, useTabs } from "./hooks";
import Tabs from "./Tabs";
import { pageConfig } from "@config";

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
  const [draggableRef, setDraggableRef] = useState<HTMLDivElement | undefined>(null);
  const ready = useRandomizeWindow(localRef);
  const { tabs, openTab, closeTab, activeTab, setActiveTab } = useTabs([name]);
  useDataPath(localRef, createButton(switchToWindow));
  useDataTab(localRef, createButton(openTab), activeTab);
  useDragonDrop(localRef, draggableRef);
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
          <div ref={setDraggableRef}>
            <span>{name}</span>
            <div><button onMouseDown={closeWindow}><Icons.Times /></button></div>
          </div>
          <Tabs {...{
            name,
            tabs,
            closeTab,
            activeTab,
            setActiveTab
          }} />
        </Bar>
        <Content>
          {(name === activeTab) ? children : pageConfig[activeTab]}
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

const Content: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.Content}>
      {children}
    </div>
  )
}

const createButton = (open) => (path) => {
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `glossy ${path.split(' ').join('-')}`;
  link.innerHTML = path;
  link.onclick = () => open(path);
  return link;
}

export default Window;