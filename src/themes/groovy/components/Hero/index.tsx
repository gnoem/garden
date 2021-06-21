import React from "react";
import * as styles from "./hero.module.css";

interface HeroProps extends React.HTMLProps<HTMLDivElement> {
  error?: string | number;
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(({ error }, ref) => {
  const showError = error
    ? styles[`e${error}`]
    : '';
  return (
    <div className={`${styles.hero} ${showError}`} ref={ref}></div>
  )
})

export default Hero;