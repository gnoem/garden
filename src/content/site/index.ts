import React from "react";
import { Book, Icons, Code, Palette, Question } from "@components/_icons";

export interface ISiteMapChildren {
  tab?: string[];
  window?: string[];
}

interface IMainPage {
  navIcon: React.FC;
  children?: ISiteMapChildren
}

interface ISiteMap {
  [mainPage: string]: IMainPage;
}

export const siteMap: ISiteMap = {
  // ABOUT
  about: {
    navIcon: Question
  },
  // NOTEBOOK
  notebook: {
    navIcon: Book,
    children: {
      tab: ['ideas', 'questions', 'coolwords', 'toadnamesideas']
    }
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
    children: {
      window: ['siteideas', 'reminders']
    }
  }
}

interface ISiteNavInfo {
  name: string;
  Icon: React.FC;
}

export const siteNav: ISiteNavInfo[] = Object.entries(siteMap).map(([name, { navIcon }]) => ({
  name,
  Icon: navIcon
}));