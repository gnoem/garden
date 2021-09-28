import React from "react";
import { ISiteMapChildren, siteMap } from "@content/site";
import { siteSections } from "@content";
import { FlattenUnion, LinkType } from "@types";

export const getChildren = (parentName: string): Required<ISiteMapChildren> => {
  const { tab, window } = siteMap[parentName]?.children ?? {};
  return {
    tab: tab ?? [],
    window: window ?? []
  }
}

interface ISectionNavigationProps {
  label: string;
  action: (name: string) => () => void;
  linkType: LinkType;
  sectionNames: string[];
}

export const SectionNavigation: React.FC<ISectionNavigationProps> = ({ label, linkType, action, sectionNames }): JSX.Element => {
  const button = linkType === 'button';

  const createNavLink = (sectionName: string): JSX.Element | null => {
    const section = siteSections[sectionName];
    if (!section?.SectionContent) return null;
    return <Link button={button} className={button ? 'glossy' : ''} click={action(sectionName)}>{section.title}</Link>
  }

  return (
    <nav aria-label={label} className={button ? 'buttons' : ''}>
      {sectionNames.map(createNavLink)}
    </nav>
  )
}

type InternalLink = {
  click: () => void;
  button?: boolean;
}

type ExternalLink = {
  href: string;
  button?: false;
}

type ILinkProps = {
  className?: string;
} & FlattenUnion<InternalLink | ExternalLink>;

export const Link: React.FC<ILinkProps> = ({ click, href, button, className, children }) => {
  const action = click ? { onClick: click } : { href, target: '_blank' };
  const props = {
    ...action,
    className,
    children
  }
  return button ? <button {...props} /> : <a {...props} />;
}