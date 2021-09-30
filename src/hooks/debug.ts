import { useEffect } from "react"

/**
 * Creates a keyboard shortcut to add a big green line inside your console
 * @param triggerKey which key to press to trigger the separator (default is 'Tab')
 */
export const useSeparator = (triggerKey: string = 'Tab'): void => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === triggerKey) {
        console.log(`%c------------`, `color: green; font-weight: bold; font-size: 2rem;`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}