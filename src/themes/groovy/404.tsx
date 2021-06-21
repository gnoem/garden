import React from "react";

import "./groovy.css";
import { Nav } from "@components";
import { Hero, NavLink, Content, Backdrop } from "./components";

const GroovyNotFound = () => {
  return (
    <>
      <Content>
        <Backdrop />
        <Hero error={404} />
      </Content>
      <Nav ariaLabel={`Options for 404 error`} addClass="errorpage">
        <NavLink {...{
          name: '',
          icon: 'home',
          handleClick: () => window.location.assign('/')
        }} />
      </Nav>
    </>
  )
}

export default GroovyNotFound;