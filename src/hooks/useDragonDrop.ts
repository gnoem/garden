import { useEffect, useState } from "react";
import { getFinalTransform } from "@utils";
import { ICoords } from "@types";

/**
 * Custom hook that you can use to make an element drag-and-droppable
 * @param element the HTML element to be made drag-and-droppable
 * @param draggable the HTML element that will actually respond to the mouse/touch events for dragging and dropping (e.g. the title bar of a draggable div: the whole div should move around when you drag it, but you can only drag it around by the title bar). if not specified, defaults to the element given in the first param
 */
const useDragonDrop = (element: HTMLElement | null, draggable: HTMLElement | null = element): void => {
  const [mouseDownCoords, setMouseDownCoords] = useState<ICoords | null>(null);
  const [elementCoords, setElementCoords] = useState<ICoords | null>(null);

  /**
   * set up initial mousedown event listener on draggable
   */
  useEffect(() => {
    if (!draggable || !element) return;
    const onPointerDown = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const { x: elementX, y: elementY } = element.getBoundingClientRect();
      setMouseDownCoords({
        x: elementX - clientX,
        y: elementY - clientY
      });
      setElementCoords(null);
    }
    draggable.addEventListener('pointerdown', onPointerDown);
    return () => draggable.removeEventListener('pointerdown', onPointerDown);
  }, [draggable, element]);

  /**
   * set up mousemove event listener
   */
  useEffect(() => {
    if (!mouseDownCoords) return;
    const onPointerUp = () => {
      setMouseDownCoords(null);
    }
    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      const { clientX, clientY } = e;
      const { x: offsetX, y: offsetY } = mouseDownCoords;
      setElementCoords({
        x: clientX + offsetX,
        y: clientY + offsetY
      });
    }
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);
    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [mouseDownCoords]);

  /**
   * transform element based on elementCoords
   */
  useEffect(() => {
    if (!elementCoords || !element) return;
    const { x: transformX, y: transformY } = elementCoords;
    element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
  }, [elementCoords, element]);

  useEffect(() => {
    if (!elementCoords || !element) return;
    const onPointerUp = () => {
      const { width, height } = element.getBoundingClientRect();
      const translateBoundaries = {
        x: window.innerWidth - (width / 2),
        y: window.innerHeight - (height / 3)
      }
      const { x, y } = getFinalTransform(elementCoords, translateBoundaries);
      setElementCoords({ x, y });
    }
    window.addEventListener('pointerup', onPointerUp);
    return () => window.removeEventListener('pointerup', onPointerUp);
  }, [!!elementCoords, element]);

}

export default useDragonDrop;