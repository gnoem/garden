import React, { useState, useEffect } from "react";
import { useDataTemplate, useDragonDrop, useTabs } from "@hooks";
import { Icons } from "@components";
import { pageConfig } from "@config";

import * as styles from "./window.module.css";
import { useRandomSpawn, useMinimizeWindows } from "./hooks";
import { Bar, Tabs, WindowContent } from "./components";

interface IWindowProps {
  name: string;
  index: number;
  active: boolean;
  registerRef: (element: HTMLDivElement) => void;
  unregisterRef: () => void;
  closeWindow: () => void;
  focusWindow: () => void;
  switchToWindow: (name: string) => void;
}

const Window: React.FC<IWindowProps> = ({
  name,
  index,
  active,
  registerRef,
  unregisterRef,
  focusWindow,
  switchToWindow,
  closeWindow,
  children
}): JSX.Element => {

  const [localRef, setLocalRef] = useState<HTMLDivElement | null>(null);
  const [barRef, setBarRef] = useState<HTMLDivElement | null>(null);
  
  const { minimized, windowMaxHeight, toggleMinimized } = useMinimizeWindows(active, focusWindow, { localRef, barRef });
  const { tabs, openTab, closeTab, activeTab, setActiveTab } = useTabs([{ name, scrolled: 0 }]);
  const ready = useRandomSpawn(localRef);
  useDragonDrop(localRef, barRef);

  useDataTemplate(localRef, createButton(switchToWindow), 'data-path');
  useDataTemplate(localRef, createButton(openTab), 'data-tab', [activeTab]);
  useDataTemplate(localRef, createLink(openTab), 'data-tab-link', [activeTab]);

  useEffect(() => {
    return unregisterRef;
  }, []);

  const windowClassName = `${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''} ${minimized ? styles.minimized : ''}`;

  const windowStyle = {
    zIndex: index,
    maxHeight: windowMaxHeight ? `${windowMaxHeight}px` : ''
  }

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
      className={windowClassName}
      onMouseDown={handleDivClick}
      style={windowStyle}
      ref={createWindowRef}>
        <Bar>
          <div ref={setBarRef}>
            <span>{pageConfig[name]?.title ?? name}</span>
            <div className={styles.buttons}>
              <button onMouseDown={toggleMinimized}>{minimized ? <Icons.WindowMaximize /> : <Icons.WindowMinimize />}</button>
              <button onMouseDown={closeWindow}><Icons.Times /></button>
            </div>
          </div>
          <Tabs {...{
            name,
            tabs,
            openTab,
            closeTab,
            activeTab
          }} />
        </Bar>
        <WindowContent {...{ name, activeTab, setActiveTab }}>
          {(name === activeTab.name) ? children : pageConfig[activeTab.name]?.jsx}
        </WindowContent>
    </div>
  )
}

const createButton = (open) => (path) => {
  if (!(path && open)) return null;
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `glossy ${path.split(' ').join('-')}`;
  link.textContent = pageConfig[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

const createLink = (open) => (path, text) => {
  if (!(path && text)) return null;
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `${path.split(' ').join('-')}`;
  link.textContent = text ?? pageConfig[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

export default Window;