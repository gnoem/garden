import React from "react";
import { ISectionComponentProps } from "@types";
import { Link } from "@content/template";

export const title = 'about this project';

export const SectionContent: React.FC<ISectionComponentProps> = (): JSX.Element => {
  return (
    <>
      <h2>about this project</h2>
      <h3>code</h3>
      <ul>
        <li>built by me using react + three.js</li>
        <li>open source! <Link href="https://github.com/gnoem/garden">take a look</Link></li>
      </ul>
      <h3>design</h3>
      <ul>
        <li>software: blender and adobe illustrator</li>
        <li>fonts: Nimbus Sans Becker, Carbon</li>
        <li>icons from <Link href="https://fontawesome.com/">font awesome</Link></li>
      </ul>
      <h3>thoughts</h3>
      <ul>
        <li>my aim with this site is to have an unstructured, open-ended environment where i can play around with code/design and practice building interactive 3d things for the web. also to show off some of my work and maybe eventually function as a 3d web dev portfolio that's separate from my <Link href="https://ngw.dev">other portfolio</Link>, which has a broader target audience</li>
        <li>a lot of the content (text/images) is filler so dont read into it too much, its mainly there because its nicer than having lorem ipsum</li>
        <li>long story short i am trying to get really good at crafting Web Experiences and make things that are interactive and immersive and artistically and conceptually compelling <span style={{ fontSize: '0.75rem' }}>and possibly find someone to pay me to make them a really cool website or even like if someone wanted to hit me up to collab on something weird and unique and interesting and just make some cool web art projects together and have fun that would be cool too....i definitely would want someone to get in touch if they were thinking that they wanted to do that..</span></li>
      </ul>
    </>
  )
}