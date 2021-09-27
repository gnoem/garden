export interface IHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export interface ITab {
  name: string;
  scrolled: number | null;
}

export type SectionType = 'child' | 'tab';
export type LinkType = 'button' | 'link';

export const dataTemplateAttributes = ['data-tab-button', 'data-tab-link', 'data-child-button', 'data-child-link'];

export type DataTemplateAttribute = typeof dataTemplateAttributes[number];