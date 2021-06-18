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
    tabs: ['ideas', 'questions', 'cool words', 'toad names ideas']
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
    children: ['site ideas', 'reminders']
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
  'about': {
    title: 'about',
    jsx: (
      <>
        <h2>about</h2>
        <p>hi i'm naomi and this is my tiny corner of the internet: part <a href="https://neustadt.fr/essays/the-small-web/" target="_blank">personal site</a>, part online playground, somewhere i can experiment with code &amp; design while also building a home for my art, writing, and other stuff [<span data-tab-link="about this project">read more about this project</span>]</p>
        <p>there is not much here yet but it is regularly updated, so keep checking back!</p>
        <h3>other places to find me online:</h3>
        <nav aria-label="External links" className="buttons">
          {externalLinks.map(({ name, url }) => <a key={name} className="glossy" href={url} target="_blank">{name}</a>)}
        </nav>
      </>
    )
  },
  'about this project': {
    title: 'about this project',
    jsx: (
      <>
        <h2>about this project</h2>
        <h3>code</h3>
        <ul>
          <li>built by me using react/gatsby and hosted on vercel</li>
          <li>open source! <a href="https://github.com/gnoem/garden" target="_blank">take a look</a></li>
        </ul>
        <h3>design</h3>
        <ul>
          <li>i make graphics in adobe illustrator</li>
          <li>fonts used for this theme: Nimbus Sans Becker (headers), Carbon (body)</li>
        </ul>
        <h3>motivation</h3>
        <ul>
          <li>the modern internet is a hellhole and we would all benefit from a return to the glory days of the early web (if this statement intrigues you, <a href="https://sadgrl.online/newoldweb/manifesto.html" target="_blank">go read this person's manifesto</a>)</li>
          <li>i get antsy if i don't have a personal project that i'm making consistent progress on</li>
          <li>i like to build immersive, interactive online spaces, and having a site like this gives me an opportunity to do that in a totally unstructured, open-ended environment - that part is far more exciting to me than actually creating the content for this place (though i obviously need content to put here or else we'd just be standing in an empty room)</li>
        </ul>
      </>
    )
  },
  'notebook': {
    title: 'notebook',
    jsx: (
      <>
        <h2>notebook</h2>
        <p>browse collections:</p>
        <nav aria-label="Notebook collections" className="buttons">
          {siteMap['notebook'].tabs.map(pageName => <span key={`data-tab:${pageName}@notebook`} data-tab={pageName}></span>)}
        </nav>
      </>
    )
  },
  'code': {
    title: 'code',
    jsx: (
      <>
        <h2>code</h2>
        <p>highlight my favorite projects i guess</p>
      </>
    )
  },
  'art': {
    title: 'art',
    jsx: (
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
    )
  },
  'misc': {
    title: 'misc',
    jsx: (
      <>
        <h2>misc</h2>
        <p>like everything else here this is under construction</p>
        <nav aria-label="Miscellaneous pages" className="buttons">
          {siteMap['misc'].children.map(pageName => <span key={`data-path:${pageName}@misc`} data-path={pageName}></span>)}
        </nav>
      </>
    )
  },
  'site ideas': {
    title: 'ideas',
    jsx: (
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
    )
  },
  'reminders': {
    title: 'reminders',
    jsx: (
      <>
        <h2>reminders</h2>
        <ul>
          <li>404 page</li>
          <li>fullscreen/expand windows?</li>
          <li>adjust window positions when page resizes</li>
          <li>routing??</li>
          <li>loading screen maybe</li>
          <li>option to increase window opacity</li>
          <li>scroll tabs somehow</li>
        </ul>
      </>
    )
  },
  'ideas': {
    title: 'ideas',
    jsx: (
      <>
        <h2>ideas</h2>
        <ul>
          <li>A gas that conducts wifi</li>
          <li>Cryptocurrency for girls only</li>
          <li>business card with just ur fingerprint</li>
          <li>good cop/bad cop daycare</li>
          <li>fire hat</li>
          <li>seatbelt for your toilet</li>
          <li>thought experiment lab in future home</li>
          <li>black plague tour of europe</li>
          <li>Warrior Snails with armored shells</li>
          <li>fanny pack full of jelly beans</li>
          <li>when u burp and u can taste the food u ate earlier.first stage of time travel</li>
          <li>Throw a concert where everyone has to wear helmets and half way through the show sacks of rocks rain down upon the crowd and you say Rock On Everybody!!</li>
          <li>Disco Math</li>
          <li>a religion that just cries</li>
        </ul>
      </>
    )
  },
  'questions': {
    title: 'questions',
    jsx: (
      <>
        <h2>questions</h2>
        <ul>
          <li>Is it possible 2 have lunch before breakfast?</li>
          <li>What is the viscosity of Gravity?</li>
          <li>how would u know if u were eating ur burrito upside down?</li>
        </ul>
      </>
    )
  },
  'cool words': {
    title: 'cool words',
    jsx: (
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
  },
  'pranks': {
    title: 'pranks',
    jsx: (
      <>
        <h2>pranks</h2>
        <ul>
          <li>*checking out of hotel* comment to front desk person: i was very much surprised and delighted by the secret potty!! do all of ur hotel rooms have secret potties?</li>
        </ul>
      </>
    )
  },
  'toad names ideas': {
    title: 'toad names ideas',
    jsx: (
      <>
        <h2>toad names ideas</h2>
        <ul>
          <li>Cheeto von Kush</li>
          <li>Boss</li>
          <li>Father john</li>
          <li>Chardonnay</li>
          <li>pee-wee</li>
          <li>Bongwater</li>
          <li>Wet Michael</li>
          <li>freddie calzone</li>
          <li>Sodom</li>
          <li>T-boy</li>
          <li>Ron paul jamaica</li>
          <li>Rand Kong</li>
          <li>Sister Mary Clotilda</li>
          <li>Kamikaze</li>
          <li>wise guy</li>
          <li>Lord Siberius</li>
        </ul>
        <h3>toad plans</h3>
        <ul>
          <li> make a hat for the toad</li>
          <li>crystals in the tank</li>
        </ul>
      </>
    )
  },
}
