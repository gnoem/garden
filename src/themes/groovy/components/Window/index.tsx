import { useDragonDrop } from "@hooks";
import { randomIntBetween } from "@utils";
import { Icons } from "@components";
import React, { useEffect, useState } from "react";
import * as styles from "./window.module.css";

interface IWindowProps {
  title: string;
  index: number;
  active: boolean;
  registerRef: (element: HTMLDivElement) => void;
  closeWindow: () => void;
  switchToWindow: () => void;
}

const Window: React.FC<IWindowProps> = ({ title, index, active, registerRef, switchToWindow, closeWindow, children }): JSX.Element => {
  const [localRef, setLocalRef] = useState<HTMLDivElement | undefined>(null);
  const [ready, setReady] = useState<boolean>(false);
  const { initDragonDrop } = useDragonDrop(localRef);
  useEffect(() => {
    /* set random position based on width/height of element */
    if (!localRef) return;
    const width = randomIntBetween(350, 600);
    const height = randomIntBetween(Math.round(width * 0.5), Math.round(width * 0.8));
    // todo remember to readjust if window resizes, dont want elements getting cut off
    const randomX = randomIntBetween(20, window.innerWidth - (width + (window.innerWidth * 0.1)));
    const randomY = randomIntBetween(20, window.innerHeight - (height + (window.innerHeight * 0.1)));
    localRef.style.width = `${width}px`;
    localRef.style.height = `${height}px`;
    localRef.style.transform = `translate3d(${randomX}px, ${randomY}px, 0)`;
    setReady(true);
  }, [localRef]);
  const createWindowRef = (element) => {
    registerRef(element);
    setLocalRef(element);
  }
  return (
    <div
      className={`${styles.Window} ${ready ? styles.ready : ''} ${active ? styles.active : ''}`}
      onMouseDown={switchToWindow}
      style={{ zIndex: index }}
      ref={createWindowRef}>
        <Bar initDragonDrop={initDragonDrop}>
          <span>
            {title}
          </span>
          <div>
            <button onMouseDown={closeWindow}><Icons.Times /></button>
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

export default Window;