import React, { useMemo, useState } from "react";
import { mainSiteNav, pageConfig } from "@config";

import { Hero, Page } from "../components";

const usePages = ({ setCurrentPage }) => {
  const [pages, setPages] = useState({});
  const content = useMemo(() => {
    return mainSiteNav.map(({ name }) => {
      const pageContent = pageConfig[name]?.jsx;
      const createPageRef = (element) => {
        setPages(prevObj => ({
          ...prevObj,
          [name]: element
        }));
      }
      if (name === 'home') {
        return <Hero ref={createPageRef} />;
      }
      if (!pageContent) return null;
      return <Page ref={createPageRef}>{pageContent}</Page>;
    });
  }, []);
  return { refs: pages, content, handleNavClick: setCurrentPage }
}

export default usePages;