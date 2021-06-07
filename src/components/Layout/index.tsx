import React from "react";

const Layout: React.FC<{ name: string }> = ({ children, name }) => {
  return (
    <div className={name}>
      {children}
    </div>
  )
}

export default Layout;