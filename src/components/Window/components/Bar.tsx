import React from "react";
import * as styles from "../window.module.css";

const Bar: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.Bar}>
      {children}
    </div>
  )
}

export default Bar;