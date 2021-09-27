import React from "react";
import { siteMap } from "@content/site";

interface ISectionNav {
  sectionType: 'child' | 'tab';
  linkType: 'button' | 'link';
  parent: string;
  sections: any;
}

type AttributeName = 'data-path' | 'data-tab' | 'data-tab-link' | 'data-child-button' | 'data-child-link' | 'data-tab-button';

export const SectionNav: React.FC<ISectionNav> = ({ sectionType, linkType, parent, sections }): (JSX.Element | null) => {
  //const attributeName: AttributeName = `data-${sectionType}-${linkType}`;
  const getAttributeName = ({ sectionType, linkType }: Pick<ISectionNav, 'sectionType' | 'linkType'>): AttributeName => {
    if (sectionType === 'child') {
      return 'data-path';
    } else {
      if (linkType === 'button') {
        return 'data-tab';
      } else {
        return 'data-tab-link';
      }
    }
  }
  const sectionNames = siteMap[parent]?.[(sectionType === 'child') ? 'children' : 'tabs'];
  if (!sectionNames) return null;

  const createNavLink = (sectionName: string): JSX.Element | null => {
    if (!sections[sectionName]) return null;
    return (
      <SectionNavLink {...{
        attributeName: getAttributeName({ sectionType, linkType }),
        parent,
        sectionName: sections[sectionName].title
      }} />
    )
  }
  
  return (
    <>
      {sectionNames.map(createNavLink)}
    </>
  )
}

interface ISectionNavLink {
  attributeName: AttributeName;
  parent: string;
  sectionName: string;
}

export const SectionNavLink: React.FC<ISectionNavLink> = ({ attributeName, parent, sectionName }): JSX.Element => {
  return (
    <span {...{
      key: `${attributeName}:${sectionName}@${parent}`,
      [attributeName]: sectionName
    }}></span>
  )
}