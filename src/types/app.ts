import React from "react";

export interface IHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export interface ITab {
  name: string;
  scrolled: number | null;
}

export interface ISectionComponentProps {
  name: string;
}

export interface ISectionModule {
  title: string;
  SectionContent: React.FC<ISectionComponentProps>
}

export interface ISectionsModule {
  [sectionName: string]: ISectionModule;
}

export type ChildType = 'window' | 'tab';
export type LinkType = 'button' | 'link';

export const dataTemplateAttributes = ['data-tab-button', 'data-tab-link', 'data-window-button', 'data-window-link'];

export type DataTemplateAttribute = typeof dataTemplateAttributes[number];