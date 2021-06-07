import React from "react";
import * as styles from "./page.module.css";

type DivProps = React.HTMLProps<HTMLDivElement>;

const Page = React.forwardRef<HTMLDivElement, DivProps>(({ children }, ref): JSX.Element => {
  return (
    <div className={styles.Wrapper} ref={ref}>
      <div className={styles.Page}>
        {children}
      </div>
    </div>
  )
})

export default Page;