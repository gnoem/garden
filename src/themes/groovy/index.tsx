import React, { useMemo, useState } from "react";

import "./groovy.css";
import { navLinks, pageConfig } from "@config";
import { Nav } from "@components";
import { mutateArray } from "@utils";
import { Hero, NavLink, Content, Backdrop, Page } from "./components";
import Window from "./components/Window";

const usePages = ({ setCurrentPage }) => {
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
  return { refs: pages, content, handleNavClick: setCurrentPage }
}

const useWindows = () => {
  const [windows, setWindows] = useState<string[]>([]);
  const [windowRefs, setWindowRefs] = useState({});
  const content = useMemo(() => {
    return windows.map(name => {
      const pageContent = pageConfig[name];
      if (!pageContent) return null;
      const createWindowRef = (element) => {
        setWindowRefs(prevObj => ({
          ...prevObj,
          [name]: element
        }));
      }
      const closeWindow = () => {
        console.log('closing window')
        // remove from array
        const index = windows.indexOf(name);
        setWindows(mutateArray((array) => array.splice(index, 1)));
        // delete ref
        setWindowRefs(prevObj => {
          const objToReturn = {...prevObj};
          delete objToReturn[name];
          return objToReturn;
        });
      }
      const switchToWindow = () => showWindow(name);
      const index = windows.indexOf(name);
      return (
        <Window
          key={name}
          title={name}
          index={index}
          active={index === windows.length - 1}
          closeWindow={closeWindow}
          switchToWindow={switchToWindow}
          registerRef={createWindowRef}>
            {pageContent}
        </Window>
      )
    });
  }, [windows]);
  const showWindow = (name) => {
    // if not in array, add to top of array
    // if in array, move to last position in array (window z-index will correspond to index)
    if (!pageConfig[name]) return null;
    const windowIndex = windows.indexOf(name);
    if (windowIndex === -1) {
      setWindows(mutateArray((array) => array.push(name)));
    } else {
      const moveArrayElementToEnd = (array, index) => {
        array.push(array.splice(index, 1)[0]);
      }
      setWindows(mutateArray((array) => moveArrayElementToEnd(array, windowIndex)));
    }
  }
  return { refs: windowRefs, content, handleNavClick: showWindow }
}

const Groovy = ({ currentPage, setCurrentPage }) => {
  const desktop = true;
  const { refs, content, handleNavClick } = desktop ? useWindows() : usePages({ setCurrentPage });
  return (
    <>
      <Content {...{ pages: refs, currentPage }}>
        <Backdrop />
        {desktop && <Hero />}
        {content}
      </Content>
      <Nav main>
        {navLinks.map(link => {
          if (desktop && (link.name === 'home')) return null;
          return <NavLink {...link} handleClick={handleNavClick} />
        })}
      </Nav>
    </>
  )
}

export default Groovy;