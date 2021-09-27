import React from "react";
import { SectionNav } from "@content/template";
import * as tabs from "./tabs";

const title = 'notebook';

const content = () => {
  return (
    <>
      <h2>notebook</h2>
      <p>browse collections:</p>
      <nav aria-label="Notebook collections" className="buttons">
        <SectionNav {...{
          sectionType: 'tab',
          linkType: 'button',
          parent: title,
          sections: tabs
        }} />
      </nav>
    </>
  )
}

export * from "./tabs";
export const notebook = {
  title,
  content
}