import React from "react";
import { ISectionComponentProps } from "@types";

export const title = 'questions';

export const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>questions</h2>
      <ul>
        <li>Is it possible 2 have lunch before breakfast?</li>
        <li>What is the viscosity of Gravity?</li>
        <li>how would u know if u were eating ur burrito upside down?</li>
      </ul>
    </>
  )
}