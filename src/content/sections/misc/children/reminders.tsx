import React from "react";
import { ISectionComponentProps } from "@types";

export const title = 'reminders';

export const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>reminders</h2>
      <ul>
        <li>404 page</li>
        <li>better gallery for art stuff, maybe a carousel</li>
        <li>fullscreen/expand windows?</li>
        <li>adjust window positions when page resizes</li>
        <li>routing??</li>
        <li>loading screen maybe</li>
        <li>option to increase window opacity</li>
        <li>scroll tabs somehow</li>
      </ul>
    </>
  )
}