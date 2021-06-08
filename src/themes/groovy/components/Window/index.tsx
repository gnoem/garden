import { useDataPath, useDragonDrop } from "@hooks";
import { randomIntBetween } from "@utils";
import { Icons } from "@components";
import React, { useEffect, useRef, useState } from "react";
import * as styles from "./window.module.css";

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
  const exitRef = useRef(null);
  const [localRef, setLocalRef] = useState<HTMLDivElement | undefined>(null);
  const [ready, setReady] = useState<boolean>(false);
  const { initDragonDrop } = useDragonDrop(localRef);
  useDataPath(localRef, createButton(switchToWindow));
  useEffect(() => {
    /* set random size/position of window */
    if (!localRef) return;
    const setWindowSize = () => {
      const isMobile = window.innerWidth < 600;
      const width = isMobile
        ? randomIntBetween(window.innerWidth * 0.75, window.innerWidth * 0.9)
        : randomIntBetween(350, 600);
      const height = isMobile
        ? randomIntBetween(Math.round(width * 0.8), Math.round(width * 1.3))
        : randomIntBetween(Math.round(width * 0.5), Math.round(width * 0.8));
      // todo remember to readjust if window resizes, dont want elements getting cut off
      const randomX = isMobile
        ? randomIntBetween(5, window.innerWidth - (width + 5))
        : randomIntBetween(20, window.innerWidth - (width + (window.innerWidth * 0.1)));
      const randomY = isMobile
        ? randomIntBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)))
        : randomIntBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)));
      localRef.style.width = `${width}px`;
      localRef.style.height = `${height}px`;
      localRef.style.transform = `translate3d(${randomX}px, ${randomY}px, 0)`;
      setReady(true);
    }
    if (!ready) {
      setWindowSize();
    }
  }, [localRef]);
  const createWindowRef = (element) => {
    registerRef(element);
    setLocalRef(element);
  }
  const handleDivClick = (e) => {
    if (exitRef.current?.contains?.(e.target)) return;
    focusWindow();
  }
  return (
    <div
      className={`${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''}`}
      onMouseDown={handleDivClick}
      style={{ zIndex: index }}
      ref={createWindowRef}>
        <Bar initDragonDrop={initDragonDrop}>
          <span>
            {name}
          </span>
          <div>
            <button onMouseDown={closeWindow} ref={exitRef}><Icons.Times /></button>
          </div>
        </Bar>
        <Content>
          {children}
        </Content>
    </div>
  )
}

const Bar: React.FC<{ initDragonDrop: (e) => void }> = ({ children, initDragonDrop }): JSX.Element => {
  return (
    <div className={styles.Bar} onMouseDown={initDragonDrop} onTouchStart={initDragonDrop}>
      {children}
    </div>
  )
}

const Content = ({ children }): JSX.Element => {
  return (
    <div className={styles.Content}>
      {children}
    </div>
  )
}

const createButton = (open) => (path) => {
  const link = document.createElement('button');
  link.setAttribute('data-link', path);
  link.className = styles.glossy;
  link.innerHTML = path;
  link.onclick = () => open(path);
  return link;
}

export default Window;