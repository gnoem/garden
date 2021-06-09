import { useEffect } from "react";

const useDataTab = (node, createLink, activeTab) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll('[data-tab]').forEach(element => {
      const path = element.getAttribute('data-tab');
      if (node.querySelector(`[data-link='${path}']`)) return;
      element.appendChild(createLink(path)); 
    });
  }, [node, activeTab]);
}

export default useDataTab;