import React from "react";
import * as tabs from "./tabs";
import { createSectionNav } from "@content/template";

const title = 'misc';

const content = () => {
  return (
    <>
      <h2>misc</h2>
      <p>like everything else here this is under construction</p>
      <nav aria-label="Miscellaneous pages" className="buttons">
        {createSectionNav({
          sectionType: 'child',
          linkType: 'button',
          parent: title,
          sections: tabs
        })}
      </nav>
    </>
  )
}

export * from "./tabs";
export const misc = {
  title,
  content
}