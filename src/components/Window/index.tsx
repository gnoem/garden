import React, { useState, useEffect } from "react";
import { useDataTemplate, useDragonDrop, useTabs } from "@hooks";
import { siteSections } from "@content";

import * as styles from "./window.module.css";
import { useRandomSpawn, useMinimizeWindows } from "./hooks";
import { Bar, TitleBar, Tabs, WindowContent } from "./components";

interface IWindowProps {
  name: string;
  index: number;
  active: boolean;
  windowRef: HTMLDivElement | null,
  registerRef: (element: HTMLDivElement) => void;
  destroyRef: () => void;
  closeWindow: () => void;
  focusWindow: () => void;
  switchToWindow: (name: string) => void;
}

const Window: React.FC<IWindowProps> = ({
  name,
  index,
  active,
  windowRef,
  registerRef,
  destroyRef,
  focusWindow,
  switchToWindow,
  closeWindow,
  children
}): JSX.Element => {

  const [titleBarRef, setTitleBarRef] = useState<HTMLDivElement | null>(null);
  
  const { minimized, windowMaxHeight, toggleMinimized } = useMinimizeWindows(active, focusWindow, { windowRef, titleBarRef });
  const { tabs, openTab, closeTab, activeTab, setActiveTab } = useTabs([{ name, scrolled: 0 }]);
  const ready = useRandomSpawn(windowRef);
  useDragonDrop(windowRef, titleBarRef);

  useDataTemplate(windowRef, createButton(switchToWindow), 'data-child-button');
  useDataTemplate(windowRef, createButton(openTab), 'data-tab-button', [activeTab]);
  useDataTemplate(windowRef, createLink(openTab), 'data-tab-link', [activeTab]);

  useEffect(() => {
    return () => {
      destroyRef();
    }
  }, []);

  const windowClassName = `${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''} ${minimized ? styles.minimized : ''}`;

  const windowStyle = {
    zIndex: index,
    maxHeight: windowMaxHeight ? `${windowMaxHeight}px` : ''
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
      ref={registerRef}>
        <Bar>
          <TitleBar {...{
            createRef: setTitleBarRef,
            title: siteSections[name]?.title ?? name,
            minimized,
            toggleMinimized,
            closeWindow
          }} />
          <Tabs {...{
            name,
            tabs,
            openTab,
            closeTab,
            activeTab
          }} />
        </Bar>
        <WindowContent {...{ name, activeTab, setActiveTab }}>
          {(name === activeTab.name) ? children : siteSections[activeTab.name]?.content()}
        </WindowContent>
    </div>
  )
}

const createButton = (open) => (path) => {
  if (!(path && open)) return null;
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `glossy ${path}`;
  link.textContent = siteSections[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

const createLink = (open) => (path, text) => {
  if (!(path && text)) return null;
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = path;
  link.textContent = text ?? siteSections[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

export default Window;