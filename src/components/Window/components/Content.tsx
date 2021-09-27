import React, { useCallback, useEffect, useRef } from "react";
import * as styles from "../window.module.css";
import { ITab } from "@types";

interface IContentProps {
  name: string;
  activeTab: ITab;
  setActiveTab: (ITab) => void;
}

const WindowContent: React.FC<IContentProps> = ({ children, name, activeTab, setActiveTab }): JSX.Element => {
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

export default WindowContent;