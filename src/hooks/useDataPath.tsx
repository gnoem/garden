import { useEffect } from "react";

const useDataPath = (node, createLink) => {
  useEffect(() => {
    if (!node) return;
    node.querySelectorAll('[data-path]').forEach(element => {
      const path = element.getAttribute('data-path');
      if (node.querySelector(`[data-link=${path}]`)) return;
      element.appendChild(createLink(path)); 
    });
  }, [node]);
}

export default useDataPath;