import React from "react";
import { siteMap } from "@content/site";
import { DataTemplateAttribute, LinkType, ChildType, ISectionsModule } from "@types";

interface ISectionNav {
  childType: ChildType;
  linkType: LinkType;
  parentName: string;
  childSections: ISectionsModule;
}

const getDataAttribute = (childType: ChildType, linkType: LinkType): DataTemplateAttribute => `data-${childType}-${linkType}`;

export const createChildNavMenu = ({ childType, linkType, parentName, childSections }: ISectionNav): (JSX.Element | null)[] => {

  const dataAttribute = getDataAttribute(childType, linkType);
  const parentSection = siteMap[parentName];
  const sectionNames: string[] = parentSection?.children?.[childType] ?? [];
  //const sectionNames: string[] = siteMap[parentName]?.[(childType === 'window') ? 'children' : 'tabs'] ?? [];

  const createNavLink = (sectionName: string): JSX.Element | null => {
    if (!childSections[sectionName]) return null;
    return (
      <InternalLink {...{
        key: `${dataAttribute}:${sectionName}@${parentName}`,
        sectionType: childType,
        type: linkType,
        to: sectionName
      }} />
    )
  }
  
  return sectionNames.map(createNavLink);

}

interface IInternalLinkProps {
  type: LinkType,
  sectionType: ChildType,
  to: string
}

export const InternalLink: React.FC<IInternalLinkProps> = ({ children, type, sectionType, to }): JSX.Element => {
  const dataAttribute = getDataAttribute(sectionType, type);
  return (
    <span {...{ [dataAttribute]: to }}>{children}</span>
  )
}