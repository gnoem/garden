import { preventTransformOffscreen } from "@utils";
import { useEffect, useState } from "react";

const useDragonDrop = (element, draggable = element) => {
  const [mouseDownCoords, setMouseDownCoords] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
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
  useEffect(() => {
    if (!element || !dragging) return;
    const dragElement = (e) => {
      e.preventDefault();
      const { clientX, clientY } = (e.type === 'touchmove') ? e.touches[0] : e;
      // get offset at time of mousedown
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