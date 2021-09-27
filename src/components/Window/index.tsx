import React, { useCallback, useState, useEffect, useRef } from "react";

import * as styles from "./window.module.css";
import { Icons } from "@components";
import { pageConfig } from "@config";
import { useDataTemplate, useDragonDrop, useTabs } from "@hooks";
import { useRandomizeWindow } from "./hooks";
import Tabs from "./Tabs";
import { ITab } from "@types";

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
  const [maxHeight, setMaxHeight] = useState<{ minimized: boolean; value?: number | null }>({ minimized: false });
  const prevMaxHeight = useRef<number | null>(null);
  const toggleMinimized = (): void => {
    if (!(localRef && barRef)) return;
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
  useDataTemplate(localRef, createButton(switchToWindow), 'data-path');
  useDataTemplate(localRef, createButton(openTab), 'data-tab', [activeTab]);
  useDataTemplate(localRef, createLink(openTab), 'data-tab-link', [activeTab]);
  useDragonDrop(localRef, barRef);
  useEffect(() => {
    return unregisterRef;
  }, []);
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
        <Content {...{ name, activeTab, setActiveTab }}>
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

interface IContentProps {
  name: string;
  activeTab: ITab;
  setActiveTab: (ITab) => void;
}

const Content: React.FC<IContentProps> = ({ children, name, activeTab, setActiveTab }): JSX.Element => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  // if switching between tabs, scroll to tab's saved scroll position:
  useEffect(() => {
    if (!contentRef.current) return;
    const amountScrolled = activeTab.scrolled ?? 0;
    contentRef.current.scrollTop = (name === activeTab.name)
      ? 0
      : amountScrolled;
    if (name === activeTab.name) {
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = amountScrolled;
        }
      }, 1); // stupid workaround but i'm done wasting time on this
    }
  }, [contentRef.current, activeTab.name]);

  const saveScrollPosition = useCallback(() => { // todo debounce?
    if (!contentRef.current) return;
    setActiveTab(prevState => ({
      ...prevState,
      scrolled: contentRef.current?.scrollTop
    }));
  }, [activeTab.name, contentRef.current]);
  return (
    <div className={styles.Content} ref={contentRef} onScroll={saveScrollPosition}>
      {children}
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