import { ITab } from "@types";
import { useEffect } from "react";

export const useDataTemplate = (
  node: HTMLDivElement | null,
  createLink: (path: string | null, linkText: string | null) => HTMLAnchorElement | null,
  attribute: string,
  dependencies: any[] = []
): void => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll(`[${attribute}]`).forEach(element => {
      const path = element.getAttribute(attribute);
      if (node.querySelector(`[data-link='${path}']`)) return;
      const linkText = element.textContent;
      element.innerHTML = '';
      const link = createLink(path, linkText);
      if (link) {
        element.appendChild(link); 
      }
    });
  }, [node, ...dependencies]);
}

export const useDataPath = (
  node: HTMLDivElement | null,
  createLink: (path: string | null) => HTMLLinkElement | null
): void => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll('[data-path]').forEach(element => {
      const path = element.getAttribute('data-path');
      if (node.querySelector(`[data-link='${path}']`)) return;
      const link = createLink(path);
      if (link) {
        element.appendChild(link); 
      }
    });
  }, [node]);
}

export const useDataTab = (
  node: HTMLDivElement | null,
  createLink: (path: string | null, linkText: string | null) => HTMLAnchorElement | null,
  attribute: string,
  activeTab: ITab
) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll(`[${attribute}]`).forEach(element => {
      const path = element.getAttribute(attribute);
      if (node.querySelector(`[data-link='${path}']`)) return;
      const linkText = element.textContent;
      element.innerHTML = '';
      const link = createLink(path, linkText);
      if (link) {
        element.appendChild(link); 
      }
    });
  }, [node, activeTab]);
}

export default useDataTemplate;