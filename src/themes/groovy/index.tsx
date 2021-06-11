import React from "react";

import "./groovy.css";
import { mainSiteNav } from "@config";
import { Nav } from "@components";
import { Hero, NavLink, Content, Backdrop } from "./components";
import { useWindows } from "./hooks";
import { useResizeWindows } from "@hooks";

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