import React from "react";
import { SectionNavigation, getChildren } from "@content/template";
import { ISectionComponentProps } from "@types";
export * from "./children";

const title = 'misc';

const SectionContent: React.FC<ISectionComponentProps> = ({ openWindow }): JSX.Element => {
  return (
    <>
      <h2>misc</h2>
      <p>like everything else here this is under construction</p>
      <SectionNavigation
        label="Miscellaneous pages"
        linkType="button"
        sectionNames={getChildren(title).window}
        action={openWindow}
      />
    </>
  )
}

export const misc = {
  title,
  SectionContent
}