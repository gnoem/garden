import { useEffect } from "react";

export const useDataTemplate = (node, createLink, attribute, dependencies = []) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll(`[${attribute}]`).forEach(element => {
      const path = element.getAttribute(attribute);
      if (node.querySelector(`[data-link='${path}']`)) return;
      const linkText = element.textContent;
      element.innerHTML = '';
      element.appendChild(createLink(path, linkText)); 
    });
  }, [node, ...dependencies]);
}

export const useDataPath = (node, createLink) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll('[data-path]').forEach(element => {
      const path = element.getAttribute('data-path');
      if (node.querySelector(`[data-link='${path}']`)) return;
      element.appendChild(createLink(path)); 
    });
  }, [node]);
}

export const useDataTab = (node, createLink, attribute, activeTab) => {
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

export default useDataTemplate;