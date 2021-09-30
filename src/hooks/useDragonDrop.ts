import { useEffect, useState } from "react";
import { preventTransformOffscreen } from "@utils";

/**
 * Custom hook that you can use to make an element drag-and-droppable
 * @param element the HTML element to be made drag-and-droppable
 * @param draggable the HTML element that will actually respond to the mouse/touch events for dragging and dropping (e.g. the title bar of a draggable div: the whole div should move around when you drag it, but you can only drag it around by the title bar). if not specified, defaults to the element given in the first param
 */
const useDragonDrop = (element: HTMLElement, draggable: HTMLElement = element): void => {
  const [mouseDownCoords, setMouseDownCoords] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  /**
   * useEffect runs if mouseDownCoords have been set
   * add mousemove listener to setDragging(true) (which will trigger the next useEffect)
   * add mouseup listener to reset dragging & mouseDownCoords states and finalize element transform, including checking to make sure the element is still visible onscreen
   */
  useEffect(() => {
    if (!mouseDownCoords) return;
    const handleMouseUp = () => {
      setDragging(false);
      setMouseDownCoords(null);
      const { width, height } = element.getBoundingClientRect();
      const elementTransform = window.getComputedStyle(element).transform;
      let { e: transformX, f: transformY } = new WebKitCSSMatrix(elementTransform);
      const transform = {
        x: transformX,
        y: transformY
      }
      const max = {
        x: window.innerWidth - (width / 2),
        y: window.innerHeight - (height / 3)
      }
      preventTransformOffscreen(element, transform, max);
    }
    const handleMouseMove = (e) => {
      e.preventDefault();
      if (!dragging) setDragging(true);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    }
  }, [mouseDownCoords, element]);
  
  /**
   * useEffect runs if dragging === true
   * add mousemove & touchmove listeners to actually transform the element based on current mouse/touch coordinates
   */
  useEffect(() => {
    if (!element || !dragging) return;
    const dragElement = (e) => {
      e.preventDefault();
      const { clientX, clientY } = (e.type === 'touchmove') ? e.touches[0] : e;
      // get offset from initial mouseDownCoords
      const [offsetX, offsetY] = [mouseDownCoords?.x, mouseDownCoords?.y];
      element.style.transform = `translate3d(${clientX + offsetX}px, ${clientY + offsetY}px, 0)`;
    }
    window.addEventListener('mousemove', dragElement);
    window.addEventListener('touchmove', dragElement);
    return () => {
      window.removeEventListener('mousemove', dragElement);
      window.removeEventListener('touchmove', dragElement);
    }
  }, [element, dragging, mouseDownCoords]);
  
  /**
   * useEffect runs as soon as element + draggable are defined
   * add mousedown & touchstart listener to setMouseDownCoords
   */
  useEffect(() => {
    if (!element || !draggable) return;
    const getCoords = (e) => {
      const { clientX, clientY } = (e.type === 'touchstart') ? e.touches[0] : e;
      const { x: elementX, y: elementY } = element.getBoundingClientRect();
      setMouseDownCoords({
        x: elementX - clientX,
        y: elementY - clientY
      });
    }
    draggable.addEventListener('mousedown', getCoords);
    draggable.addEventListener('touchstart', getCoords);
    return () => {
      draggable.removeEventListener('mousedown', getCoords);
      draggable.removeEventListener('touchstart', getCoords);
    }
  }, [element, draggable]);
}

export default useDragonDrop;