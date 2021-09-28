import React from "react";
import { ISectionComponentProps } from "@types";

export const title = 'cool words';

export const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>cool words</h2>
      <ul>
        <li>lecherous</li>
        <li>fortuitous</li>
        <li>lugubrious</li>
      </ul>
      <h3>cool  to say</h3>
      <ul>
        <li>valid as a salad</li>
        <li>Maybe she's corn with it - maybe its maple beans</li>
        <li>really steams my bean</li>
        <li>Charles Schwimmer's Scabs</li>
      </ul>
    </>
  )
}