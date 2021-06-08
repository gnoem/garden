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
    name: 'ngw.dev',
    url: 'https://ngw.dev'
  }
]

export const navLinks = [
  { name: 'about', icon: 'question' },
  { name: 'notebook', icon: 'book' },
  { name: 'code', icon: 'code' },
  { name: 'art', icon: 'palette' },
  { name: 'misc', icon: 'icons' }
]

export const siteMap = {
  misc: {
    children: ['ideas', 'reminders']
  },
  ideas: {
    parent: 'misc'
  },
  reminders: {
    parent: 'misc'
  }
}

export const iconsMap = {
  home: (props) => <Home {...props} />,
  question: (props) => <Question {...props} />,
  book: (props) => <Book {...props} />,
  palette: (props) => <Palette {...props} />,
  code: (props) => <Code {...props} />,
  icons: (props) => <Icons {...props} />,
}

export const pageConfig = {
  about: (
    <>
      <h2>about</h2>
      <p>hi i'm naomi and this page is the little corner of the internet where i experiment with code / design in public</p>
      <p>there is almost nothing here yet but im planning to add a ton soon so keep checking back!</p>
      <h3>other places to find me online:</h3>
      <nav aria-label="External links" className="buttons">
        {externalLinks.map(({ name, url }) => <a key={name} className="glossy" href={url} target="_blank">{name}</a>)}
      </nav>
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
      <h2>misc</h2>
      <p>like everything else here this is under construction</p>
      <nav aria-label="Miscellaneous pages" className="buttons">
        {siteMap['misc'].children.map(pageName => <span data-path={pageName}></span>)}
      </nav>
    </>
  ),
  ideas: (
    <>
      <h2>ideas</h2>
      <h3>what else can i put on this site</h3>
      <ul>
        <li>emoji art gallery</li>
        <li>dream journal</li>
        <li>interactive virtual altar!!</li>
        <li>shrines to things i like</li>
        <li>multiple site themes</li>
        <li>soundcloud</li>
        <li>guestbook or thing where people can say hi or contribute in some way</li>
        <li>polls!! anytime I want community input on a decision or just for fun</li>
        <li>or more open ended suggestion box like toad names ideas etc</li>
        <li>my criminal minds episode script</li>
        <li>earthquake/volcano tracker</li>
        <li>list of wikipedia contributions</li>
        <li>site affiliates if i can find other people with similar things</li>
      </ul>
      <h3>code/art/theory intensive</h3>
      <ul>
        <li>mini MMO if I can figure out how to get <a href="https://vercel.com/guides/deploying-pusher-channels-with-vercel" target="_blank">websockets working on vercel</a></li>
        <li>closet organizer like on clueless where visitors can create outfits from my OWN WARDROBE and send them to me as suggestions</li>
        <li>tamagotchi simulator</li>
        <li>naomi's magic beans... one day</li>
      </ul>
    </>
  ),
  reminders: (
    <>
      <h2>reminders</h2>
      <ul>
        <li>cuter scrollbars</li>
        <li>cuter bullet points</li>
        <li>adjust window positions when page resizes</li>
        <li>resize windows from all edges not just bottom right corner, also needs to work with touch screens</li>
        <li>clicking *any* button on inactive window should prevent default</li>
      </ul>
    </>
  )
}

const data = {
  externalLinks,
  navLinks
}

export default data;