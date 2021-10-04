import React, { useCallback, useEffect, useRef } from "react";
import * as styles from "../window.module.css";
import { ITab } from "@types";

interface IContentProps {
  name: string;
  activeTab: ITab;
  saveScrollPosition: (value: number) => void;
}

const WindowContent: React.FC<IContentProps> = ({ children, name, activeTab, saveScrollPosition }): JSX.Element => {
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

  const handleScroll = useCallback(() => { // todo debounce?
    if (!contentRef.current) return;
    saveScrollPosition(contentRef.current.scrollTop);
  }, [activeTab.name, contentRef.current]);

  return (
    <div className={styles.Content} ref={contentRef} onScroll={handleScroll}>
      {children}
    </div>
  )
}

export default WindowContent;