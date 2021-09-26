import { useEffect } from "react"

export const useSeparator = () => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Tab') {
        console.log(`%c------------`, `color: green; font-weight: bold; font-size: 2rem;`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}