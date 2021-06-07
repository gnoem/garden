import React from "react";

const Nav: React.FC<{ main?: boolean; ariaLabel?: string; }> = ({ children, main, ariaLabel }): JSX.Element => {
  if (!children) return null;
  return (
    <nav aria-label={main ? `Main site` : ariaLabel}>
      {children}
    </nav>
  )
}

export default Nav;