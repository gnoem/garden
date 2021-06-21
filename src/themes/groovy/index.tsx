import React from "react";

import "./groovy.css";
import { Nav } from "@components";
import { mainSiteNav } from "@config";
import { useResizeWindows } from "@hooks";
import { Hero, NavLink, Content, Backdrop } from "./components";
import { useWindows } from "./hooks";

const Groovy = () => {
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <>
      <Content>
        <Backdrop />
        <Hero />
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