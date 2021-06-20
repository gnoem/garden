import React, { useState } from "react";

import * as styles from "./window.module.css";
import { Icons } from "@components";
import { useDataPath, useDataTab, useDragonDrop } from "@hooks";
import { ITab, useRandomizeWindow, useTabs } from "./hooks";
import Tabs from "./Tabs";
import { pageConfig } from "@config";
import { useRef } from "react";
import { useEffect } from "react";

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
  const [barRef, setBarRef] = useState<HTMLDivElement | undefined>(null);
  const [maxHeight, setMaxHeight] = useState<{ minimized: boolean; value?: number }>({ minimized: false });
  const prevMaxHeight = useRef<number | undefined>(null);
  const toggleMinimized = (): void => {
    if (maxHeight.minimized) {
      if (!active) focusWindow();
      setTimeout(() => {
        setMaxHeight({
          minimized: false,
          value: prevMaxHeight.current
        });
        setTimeout(() => {
          localRef.style.maxHeight = '';
        }, 200); // transition duration
      }, active ? 0 : 10); // for some reason, if also focusing window, max height transition doesn't work without timeout
    } else {
      // get current height of window and store in ref
      const { height: currentHeight } = localRef.getBoundingClientRect();
      prevMaxHeight.current = currentHeight;
      localRef.style.maxHeight = `${currentHeight}px`;
      setTimeout(() => {
        setMaxHeight({
          minimized: true,
          value: barRef.getBoundingClientRect().height
        });
      }, 10);
    }
  }
  const ready = useRandomizeWindow(localRef);
  const { tabs, openTab, closeTab, activeTab, setActiveTab } = useTabs([{ name, scrolled: 0 }]);
  useDataPath(localRef, createButton(switchToWindow));
  useDataTab(localRef, createButton(openTab), 'data-tab', activeTab);
  useDataTab(localRef, createLink(openTab), 'data-tab-link', activeTab);
  useDragonDrop(localRef, barRef);
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
      className={`${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''} ${maxHeight.minimized ? styles.minimized : ''}`}
      onMouseDown={handleDivClick}
      style={{ zIndex: index, maxHeight: maxHeight.value ? `${maxHeight.value}px` : '' }}
      ref={createWindowRef}>
        <Bar>
          <div ref={setBarRef}>
            <span>{pageConfig[name]?.title ?? name}</span>
            <div className={styles.buttons}>
              <button onMouseDown={toggleMinimized}>{maxHeight.minimized ? <Icons.WindowMaximize /> : <Icons.WindowMinimize />}</button>
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
        <Content {...{ tab: activeTab, setActiveTab }}>
          {(name === activeTab.name) ? children : pageConfig[activeTab.name]?.jsx}
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

const Content: React.FC<{ tab: ITab, setActiveTab: (ITab) => void }> = ({ children, tab, setActiveTab }): JSX.Element => {
  const contentRef = useRef(null);
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTo({
      top: tab.scrolled,
      left: 0
    });
  }, [tab.name]);
  useEffect(() => {
    if (!contentRef.current) return;
    const saveScrollPosition = () => { // todo debounce
      setActiveTab(prevState => ({
        ...prevState,
        scrolled: contentRef.current.scrollTop
      }));
      console.log(`${tab.name}: ${contentRef.current.scrollTop}`)
    }
    contentRef.current.addEventListener('scroll', saveScrollPosition);
    return () => contentRef.current?.removeEventListener('scroll', saveScrollPosition);
  }, [contentRef.current, tab.name]);
  return (
    <div className={styles.Content} ref={contentRef}>
      {children}
    </div>
  )
}

const createButton = (open) => (path) => {
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `glossy ${path.split(' ').join('-')}`;
  link.textContent = pageConfig[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

const createLink = (open) => (path, text) => {
  const link = document.createElement('a');
  link.setAttribute('data-link', path);
  link.className = `${path.split(' ').join('-')}`;
  link.textContent = text ?? pageConfig[path]?.title ?? path;
  link.onclick = () => open(path);
  return link;
}

export default Window;