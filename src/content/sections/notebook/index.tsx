import React from "react";
import { SectionNavigation, getChildren } from "@content/template";
import { ISectionComponentProps } from "@types";
export * from "./children";

const title = 'notebook';

const SectionContent: React.FC<ISectionComponentProps> = ({ openTab }): JSX.Element => {
  return (
    <>
      <h2>notebook</h2>
      <p>browse collections:</p>
      <SectionNavigation
        label="Notebook collections"
        linkType="button"
        action={openTab}
        sectionNames={getChildren(title).tab}
      />
    </>
  )
}

export const notebook = {
  title,
  SectionContent
}