import React from "react";
import { createChildNavMenu } from "@content/template";
import { ISectionComponentProps } from "@types";
import * as childSections from "./children";

const title = 'notebook';

const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>notebook</h2>
      <p>browse collections:</p>
      <nav aria-label="Notebook collections" className="buttons">
        {createChildNavMenu({
          childType: 'tab',
          linkType: 'button',
          parentName: title,
          childSections
        })}
      </nav>
    </>
  )
}

export * from "./children";

export const notebook = {
  title,
  SectionContent
}