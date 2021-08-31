import React, { useRef } from "react";
import * as styles from "./content.module.css";

const Content: React.FC = ({ children }): JSX.Element => {
  const contentRef = useRef(null);
  return (
    <div className={styles.Content} ref={contentRef}>
      {children}
    </div>
  )
}

export default Content;