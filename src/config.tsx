import React from "react";
import { Home, Book, Icons, Code, Palette, Question } from "./components/_icons"

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

const siteMap = {
  // ABOUT
  about: {
    navIcon: 'question'
  },
  // NOTEBOOK
  notebook: {
    navIcon: 'book',
    tabs: ['concepts', 'questions', 'cool words']
    //children: ['dream journal', 'concepts', 'spells', 'agendas', 'toad names ideas', 'rantings']
  },
  // CODE
  code: {
    navIcon: 'code'
  },
  // ART
  art: {
    navIcon: 'palette'
  },
  // MISC
  misc: {
    navIcon: 'icons',
    children: ['ideas', 'reminders']
  }
}

const mainPages = Object.keys(siteMap).filter(page => {
  return siteMap[page].navIcon;
});

export const mainSiteNav = mainPages.map(pageName => ({
  name: pageName,
  icon: siteMap[pageName]?.navIcon
}));

export const iconsMap = {
  home: (props) => <Home {...props} />,
  question: (props) => <Question {...props} />,
  book: (props) => <Book {...props} />,
  palette: (props) => <Palette {...props} />,
  code: (props) => <Code {...props} />,
  icons: (props) => <Icons {...props} />,
}

export const pageConfig = {
  'about': (
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
  'notebook': (
    <>
      <h2>notebook</h2>
      <p>browse collections:</p>
      <nav aria-label="Notebook collections" className="buttons">
        {siteMap['notebook'].tabs.map(pageName => <span key={`data-tab:${pageName}@notebook`} data-tab={pageName}></span>)}
      </nav>
    </>
  ),
  'code': (
    <>
      <h2>code</h2>
      <p>highlight my favorite projects i guess</p>
    </>
  ),
  'art': (
    <>
      <h2>art</h2>
      <div style={{
        width: '250px',
        maxWidth: '100%',
        fontSize: '0'
      }}>
        <img src="https://i.imgur.com/MFZ0A2w.png" style={{ width: '100%', height: 'auto' }} alt="portrait of chester the cheetah, 2021" />
      </div>
    </>
  ),
  'misc': (
    <>
      <h2>misc</h2>
      <p>like everything else here this is under construction</p>
      <nav aria-label="Miscellaneous pages" className="buttons">
        {siteMap['misc'].children.map(pageName => <span key={`data-path:${pageName}@misc`} data-path={pageName}></span>)}
      </nav>
    </>
  ),
  'ideas': (
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
        <li>easter eggs everywhere</li>
      </ul>
      <h3>code/art/theory intensive</h3>
      <ul>
        <li>mini MMO if I can figure out how to get <a href="https://vercel.com/guides/deploying-pusher-channels-with-vercel" target="_blank">websockets working on vercel</a></li>
        <li>closet organizer like on clueless where visitors can create outfits from my OWN WARDROBE and send them to me as suggestions</li>
        <li>tamagotchi simulator</li>
        <li>naomi's magic beans... one day</li>
      </ul>
      <h3>theme ideas</h3>
      <ul>
        <li>EV style pixel art town</li>
      </ul>
    </>
  ),
  'reminders': (
    <>
      <h2>reminders</h2>
      <ul>
        <li>404 page</li>
        <li>minimize window button and maybe fullscreen</li>
        <li>adjust window positions when page resizes</li>
        <li>resize windows from all edges not just bottom right corner, also needs to work with touch screens</li>
        <li>routing??</li>
        <li>loading screen maybe</li>
        <li>option to increase window opacity</li>
      </ul>
    </>
  ),
  'concepts': (
    <>
      <h2>concepts</h2>
      <ul>
        <li>A gas that conducts wifi</li>
        <li>Cryptocurrency for girls only</li>
        <li>business card with just ur fingerprint</li>
        <li>good cop/bad cop daycare</li>
        <li>a religion that just cries</li>
        <li>nightly annihilation of time</li>
        <li>fire hat</li>
        <li>thought experiment lab in future home</li>
        <li>black plague tour of europe</li>
      </ul>
    </>
  ),
  'questions': (
    <>
      <h2>questions</h2>
      <ul>
        <li>Is it possible 2 have lunch before breakfast?</li>
        <li>What is the viscosity of Gravity?</li>
      </ul>
    </>
  ),
  'cool words': (
    <>
      <h2>cool words</h2>
      <ul>
        <li>lecherous</li>
        <li>fortuitous</li>
        <li>lugubrious</li>
      </ul>
    </>
  ),
}
