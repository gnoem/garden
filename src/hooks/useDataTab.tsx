import { useEffect } from "react";

const useDataTab = (node, createLink, attribute, activeTab) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll(`[${attribute}]`).forEach(element => {
      const path = element.getAttribute(attribute);
      if (node.querySelector(`[data-link='${path}']`)) return;
      const linkText = element.textContent;
      element.innerHTML = '';
      element.appendChild(createLink(path, linkText)); 
    });
  }, [node, activeTab]);
}

export default useDataTab;