import React, { useState } from "react";
import { useDragonDrop, useTabs } from "@hooks";
import { siteSections } from "@content";

import * as styles from "./window.module.css";
import { useRandomSpawn, useResizeWindow, useMinimizeWindows } from "./hooks";
import { Bar, TitleBar, Tabs, WindowContent } from "./components";
import { ISectionModule } from "@types";

interface IWindowProps {
  name: string;
  index: number;
  active: boolean;
  closeWindow: () => void;
  focusWindow: () => void;
  switchToWindow: (name: string) => void;
}

const Window: React.FC<IWindowProps> = ({
  name,
  index,
  active,
  focusWindow,
  switchToWindow,
  closeWindow
}): JSX.Element => {

  const [windowRef, setWindowRef] = useState<HTMLDivElement | null>(null);
  const [titleBarRef, setTitleBarRef] = useState<HTMLDivElement | null>(null);
  
  const { minimized, windowMaxHeight, toggleMinimized } = useMinimizeWindows(active, focusWindow, { windowRef, titleBarRef });
  const { tabs, openTab, closeTab, activeTab, saveScrollPosition } = useTabs(name);
  const ready = useRandomSpawn(windowRef);
  useDragonDrop(windowRef, titleBarRef);
  useResizeWindow({ name, windowRef });

  const windowClassName = `${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''} ${minimized ? styles.minimized : ''}`;

  const windowStyle = {
    zIndex: index,
    maxHeight: windowMaxHeight ? `${windowMaxHeight}px` : ''
  }

  const handleDivClick = (e) => {
    if (e.target.closest('button')) return;
    focusWindow();
  }

  const { SectionContent }: ISectionModule = siteSections[activeTab.name] ?? siteSections.fallbackSection;

  return (
    <div
      className={windowClassName}
      onMouseDown={handleDivClick}
      style={windowStyle}
      ref={setWindowRef}>
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
        <WindowContent {...{ name, activeTab, saveScrollPosition: saveScrollPosition }}>
          <SectionContent {...{
            name: activeTab.name,
            openTab: (tabName: string) => () => openTab(tabName),
            openWindow: (windowName: string) => () => switchToWindow(windowName)
          }} />
        </WindowContent>
    </div>
  )
}

export default Window;