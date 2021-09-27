import React from "react";
import * as styles from "../window.module.css";
import { Icons } from "@components";

interface ITitleBarProps {
  createRef: (element: HTMLDivElement) => void;
  title: string;
  minimized: boolean;
  toggleMinimized: () => void;
  closeWindow: () => void;
}

const TitleBar: React.FC<ITitleBarProps> = ({ createRef, title, minimized, toggleMinimized, closeWindow }): JSX.Element => {
  return (
    <div ref={createRef}>
      <span>{title}</span>
      <div className={styles.buttons}>
        <button onMouseDown={toggleMinimized}>{minimized ? <Icons.WindowMaximize /> : <Icons.WindowMinimize />}</button>
        <button onMouseDown={closeWindow}><Icons.Times /></button>
      </div>
    </div>
  )
}

export default TitleBar;