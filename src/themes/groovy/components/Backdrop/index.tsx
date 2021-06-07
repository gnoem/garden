import React from "react";
import * as styles from "./backdrop.module.css";

const Backdrop: React.FC = ({ children }): JSX.Element => {
  return (
    <div className={styles.bg}>
      {children}
    </div>
  )
}

export default Backdrop;