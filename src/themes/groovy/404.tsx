import React from "react";

import "./groovy.css";
import * as heroStyles from "./hero.module.css";
import { Hero, Nav, NavLink } from "@components";
import { Content, Backdrop } from "./components";

const GroovyNotFound = () => {
  return (
    <>
      <Content>
        <Backdrop />
        <Hero styles={heroStyles} error={404} />
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