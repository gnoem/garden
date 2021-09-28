import React from "react";
import { ISectionComponentProps } from "@types";

const title = 'code';

const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>code</h2>
      <p>highlight my favorite projects i guess</p>
    </>
  )
}

export const code = {
  title,
  SectionContent
}