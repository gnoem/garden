import React from "react";

interface HeroProps extends React.HTMLProps<HTMLDivElement> {
  styles: any;
  error?: string | number;
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(({ styles, error }, ref) => {
  const showError = error
    ? styles[`e${error}`]
    : '';
  return (
    <div className={`${styles.hero} ${showError}`} ref={ref}></div>
  )
})

export default Hero;