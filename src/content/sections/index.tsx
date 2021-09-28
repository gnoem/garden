import React from "react";
import { ISectionComponentProps } from "@types";

/**
 * NOTE!!
 * the hierarchy of files in each section folder is purely for organizational purposes - everything exported from here is exported at the same level
 * the app does not know which sections are parents or children of other sections except by looking at the siteMap
*/

export * from "./about";
export * from "./notebook";
export * from "./code";
export * from "./art";
export * from "./misc";

const FallbackComponent: React.FC<ISectionComponentProps> = ({ name }): JSX.Element => {
  return (
    <>
      <h2>something went wrong!</h2>
      <p>so sorry about that!!</p>
      <p>i would much appreciate it if you could <a href={`mailto:contact@ngw.dev?subject=page ${name} missing!`}>email me</a> letting me know that this happened so I can fix this broken link asap. thank you!!</p>
    </>
  )
}

export const fallbackSection = { // in case sections[sectionName] is missing
  title: 'something went wrong',
  SectionContent: FallbackComponent
}