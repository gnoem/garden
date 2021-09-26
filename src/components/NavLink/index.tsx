import React from "react";
import * as styles from "./navLink.module.css";
import { iconsMap } from "@config";

interface INavLinkProps {
  name: string;
  icon: string;
  handleClick: (name: string) => void;
}

const NavLink: React.FC<INavLinkProps> = ({ name, icon, handleClick }): (JSX.Element | null) => {
  const showIcon = iconsMap[icon];
  if (!showIcon) return null;
  return (
    <button className={styles.navLink} onClick={() => handleClick(name)}>{showIcon()}</button>
  )
}

export default NavLink;