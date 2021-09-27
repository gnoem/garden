import { InternalLink } from "@content/template";
import React from "react";
export * from "./tabs";

const title = 'about';

const externalLinks = [
  {
    name: 'github',
    url: 'https://github.com/gnoem'
  },
  {
    name: 'instagram',
    url: 'https://instagram.com/naomi.g.w'
  },
  {
    name: 'ngw.dev',
    url: 'https://ngw.dev'
  }
]

const content = () => {
  return (
    <>
      <h2>about</h2>
      <p>hi i'm naomi and this is my Graphical Web Experimentation Laboratory
        [<InternalLink type="link" sectionType="tab" to="aboutthisproject">read more about this project?</InternalLink>]
      </p>
      <p>not that much stuff here yet but it is regularly updated so keep checking back!</p>
      <h3>other places to find me online:</h3>
      <nav aria-label="External links" className="buttons">
        {externalLinks.map(({ name, url }) => <a key={name} className="glossy" href={url} target="_blank">{name}</a>)}
      </nav>
    </>
  )
}

export const about = {
  title,
  content
}