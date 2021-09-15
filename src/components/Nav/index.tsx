import React from "react";

interface INavProps {
  main?: boolean;
  ariaLabel?: string;
  addClass?: string;
}

const Nav: React.FC<INavProps> = ({ children, main, ariaLabel, addClass }): JSX.Element => {
  if (!children) return null;
  return (
    <nav data-main={main} aria-label={main ? `Main site` : ariaLabel} className={addClass}>
      {children}
    </nav>
  )
}

export default Nav;