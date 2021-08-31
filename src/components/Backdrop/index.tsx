import React from "react";

interface BackdropProps extends React.HTMLProps<HTMLDivElement> {
  styles?: any;
}

const Backdrop: React.FC<BackdropProps> = ({ styles, children }): JSX.Element => {
  return (
    <div className={styles?.bg}>
      {children}
    </div>
  )
}

export default Backdrop;