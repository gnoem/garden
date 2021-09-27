import React from "react";
import * as styles from "./navLink.module.css";

interface INavLinkProps {
  name: string;
  Icon: React.FC;
  handleClick: (name: string) => void;
}

const NavLink: React.FC<INavLinkProps> = ({ name, Icon, handleClick }): (JSX.Element | null) => {
  return (
    <button className={styles.navLink} onClick={() => handleClick(name)}><Icon /></button>
  )
}

export default NavLink;