import React, { useMemo, useState } from "react";

import "./groovy.css";
import { navLinks, pageConfig } from "@config";
import { Nav } from "@components";
import { Hero, NavLink, Content, Backdrop, Page } from "./components";

const Groovy = ({ currentPage, setCurrentPage }) => {
  const [pages, setPages] = useState({});
  const content = useMemo(() => {
    return navLinks.map(({ name }) => {
      const page = pageConfig[name];
      const createPageRef = (element) => {
        setPages(prevObj => ({
          ...prevObj,
          [name]: element
        }));
      }
      if (name === 'home') {
        return <Hero ref={createPageRef} />;
      }
      if (!page) return null;
      return <Page ref={createPageRef}>{page}</Page>;
    });
  }, []);
  return (
    <>
      <Content {...{ pages, currentPage }}>
        <Backdrop />
        {content}
      </Content>
      <Nav main>
        {navLinks.map(link => <NavLink {...link} handleClick={setCurrentPage} />)}
      </Nav>
    </>
  )
}

export default Groovy;