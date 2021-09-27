//import { dataTemplateAttributes } from "@types";
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

/* export const useDataTemplating = (
  section: HTMLDivElement | null,
  action: () => void, // switch to window or open tab
  dependencies: any[] = []
): void => {

  useEffect(() => {
    if (!section) return;

    const runReplacement = (dataAttribute: string): void => {
      section.querySelectorAll(`[${dataAttribute}]`).forEach((element: Element): void => {
        const target = element.getAttribute(dataAttribute);
        if (section.querySelector(`[data-link='${target}']`)) return; // already replaced, so skip
        const linkText = element.textContent;
        element.innerHTML = '';

      });
    }

    dataTemplateAttributes.forEach(runReplacement);
  }, [section, ...dependencies]);

} */

export default useDataTemplate;