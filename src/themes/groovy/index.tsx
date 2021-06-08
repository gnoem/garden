import React from "react";

import "./groovy.css";
import { navLinks } from "@config";
import { Nav } from "@components";
import { Hero, NavLink, Content, Backdrop } from "./components";
import { useWindows } from "./hooks";

const Groovy = () => {
  const { content, handleNavClick } = useWindows();
  return (
    <>
      <Content>
        <Backdrop />
        <Hero />
        {content}
      </Content>
      <Nav main>
        {navLinks.map(link => {
          return <NavLink {...link} handleClick={handleNavClick} />
        })}
      </Nav>
    </>
  )
}

export default Groovy;