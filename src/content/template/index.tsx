import React from "react";
import { siteMap } from "@content/site";
import { DataTemplateAttribute, LinkType, SectionType } from "@types";

interface ISectionNav {
  sectionType: SectionType;
  linkType: LinkType;
  parent: string;
  sections: any;
}

const getDataAttribute = (sectionType: SectionType, linkType: LinkType): DataTemplateAttribute => `data-${sectionType}-${linkType}`;

export const createSectionNav = ({ sectionType, linkType, parent, sections }: ISectionNav): (JSX.Element | null)[] => {

  const dataAttribute = getDataAttribute(sectionType, linkType);
  const sectionNames: string[] = siteMap[parent]?.[(sectionType === 'child') ? 'children' : 'tabs'] ?? [];

  const createNavLink = (sectionName: string): JSX.Element | null => {
    if (!sections[sectionName]) return null;
    return (
      <InternalLink {...{
        key: `${dataAttribute}:${sectionName}@${parent}`,
        sectionType,
        type: linkType,
        to: sectionName
      }} />
    )
  }
  
  return sectionNames.map(createNavLink);

}

interface IInternalLinkProps {
  type: LinkType,
  sectionType: SectionType,
  to: string
}

export const InternalLink: React.FC<IInternalLinkProps> = ({ children, type, sectionType, to }): JSX.Element => {
  const dataAttribute = getDataAttribute(sectionType, type);
  return (
    <span {...{ [dataAttribute]: to }}>{children}</span>
  )
}