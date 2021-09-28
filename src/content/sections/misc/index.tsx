import React from "react";
import { createChildNavMenu } from "@content/template";
import { ISectionComponentProps } from "@types";
import * as childSections from "./children";

const title = 'misc';

const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>misc</h2>
      <p>like everything else here this is under construction</p>
      <nav aria-label="Miscellaneous pages" className="buttons">
        {createChildNavMenu({
          childType: 'window',
          linkType: 'button',
          parentName: title,
          childSections
        })}
      </nav>
    </>
  )
}

export * from "./children";

export const misc = {
  title,
  SectionContent
}