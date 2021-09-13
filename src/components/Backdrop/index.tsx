import React from "react";
import * as styles from "./backdrop.module.css";

interface BackdropProps extends React.HTMLProps<HTMLDivElement> {
  styles?: any;
}

const Backdrop: React.FC<BackdropProps> = ({ styles: themeStyles, children }): JSX.Element => {
  return (
    <div className={themeStyles?.bg ?? styles.bg}>
      {children}
    </div>
  )
}

export default Backdrop;