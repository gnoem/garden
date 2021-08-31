import React from "react";

import "./groovy.css";
import * as heroStyles from "./hero.module.css";
import { Hero, Nav, NavLink } from "@components";
import { mainSiteNav } from "@config";
import { useResizeWindows, useWindows } from "@hooks";
import { Content, Backdrop } from "./components";

const Groovy = () => {
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <>
      <Content>
        <Backdrop />
        <Hero styles={heroStyles} />
        {content}
      </Content>
      <Nav main>
        {mainSiteNav.map(({ name, icon }) => (
          <NavLink {...{
            name,
            icon,
            handleClick: handleNavClick
          }} />
        ))}
      </Nav>
    </>
  )
}

export default Groovy;