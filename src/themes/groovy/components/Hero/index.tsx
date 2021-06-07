import React from "react";
import * as styles from "./hero.module.css";

const Hero = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.hero} ref={ref}></div>
  )
})

export default Hero;