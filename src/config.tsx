import React from "react";
import { Home, Book, Icons, Code, Palette, Question } from "./components/_icons"

export const externalLinks = [
  {
    name: 'github',
    url: 'https://github.com/gnoem'
  },
  {
    name: 'instagram',
    url: 'https://instagram.com/naomi.g.w'
  },
  {
    name: 'dev portfolio',
    url: 'https://ngw.dev'
  }
]

export const navLinks = [
  { name: 'home', icon: 'home' },
  { name: 'about', icon: 'question' },
  { name: 'notebook', icon: 'book' },
  { name: 'code', icon: 'code' },
  { name: 'art', icon: 'palette' },
  { name: 'misc', icon: 'icons' }
]

export const iconsMap = {
  home: (props) => <Home {...props} />,
  question: (props) => <Question {...props} />,
  book: (props) => <Book {...props} />,
  palette: (props) => <Palette {...props} />,
  code: (props) => <Code {...props} />,
  icons: (props) => <Icons {...props} />,
}

export const pageConfig = {
  home: null,
  about: (
    <>
      <h2>about</h2>
      <p>hi i'm naomi and this page is the little corner of the internet where i experiment with code / design in public</p>
      <p>there is almost nothing here yet but im planning to add a ton soon so keep checking back!</p>
      <h3>other places to find me online:</h3>
      <ul>
        {externalLinks.map(({ name, url }) => <li><a href={url} target="_blank">{name}</a></li>)}
      </ul>
    </>
  ),
  notebook: (
    <>
      <h2>notebook</h2>
      <p><b>jun 7, 21</b> - Is it possible 2 have lunch before breakfast?</p>
    </>
  ),
  code: (
    <>
      <h2>code</h2>
      <p>highlight my favorite projects i guess</p>
    </>
  ),
  art: (
    <>
      <h2>art</h2>
      <p>might add some art too who knows</p>
    </>
  ),
  misc: (
    <>
      <h2>miscellaneous</h2>
      <ul>
        <li>dream journal</li>
        <li>virtual altar</li>
      </ul>
    </>
  ),
}

const data = {
  externalLinks,
  navLinks
}

export default data;