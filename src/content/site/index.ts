import { Book, Icons, Code, Palette, Question } from "@components/_icons";

export const siteMap = {
  // ABOUT
  about: {
    navIcon: Question
  },
  // NOTEBOOK
  notebook: {
    navIcon: Book,
    tabs: ['ideas', 'questions', 'coolwords', 'toadnamesideas']
  },
  // CODE
  code: {
    navIcon: Code
  },
  // ART
  art: {
    navIcon: Palette,
  },
  // MISC
  misc: {
    navIcon: Icons,
    children: ['siteideas', 'reminders']
  }
}

export const siteNav = Object.entries(siteMap).map(([name, { navIcon }]) => ({
  name,
  Icon: navIcon
}));