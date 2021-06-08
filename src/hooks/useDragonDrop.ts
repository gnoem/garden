import { useEffect, useState } from "react";

const useDragonDrop = (element) => {
  const [mouseDownCoords, setMouseDownCoords] = useState<{ x: number; y: number } | undefined>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  useEffect(() => {
    if (!mouseDownCoords) return;
    const handleMouseUp = () => {
      setDragging(false);
      setMouseDownCoords(null);
      const restoreOffscreenElement = () => {
        const { transform } = window.getComputedStyle(element);
        let { e: transformX, f: transformY } = new WebKitCSSMatrix(transform);
        const checkTopLeft = () => {
          if (transformX >= 0 && transformY >= 0) return;
          if (transformX < 0) transformX = 0;
          if (transformY < 0) transformY = 0;
          element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
        }
        const checkBottomRight = () => {
          // just need the top and left half to be visible
          const { width, height } = element.getBoundingClientRect();
          // maximum X is window.innerWidth - half element width
          const maxX = window.innerWidth - (width / 2);
          const maxY = window.innerHeight - (height / 3);
          if (transformX <= maxX && transformY <= maxY) return;
          if (transformX > maxX) transformX = maxX;
          if (transformY > maxY) transformY = maxY;
          element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
          // if transformX > maxX && transformY > maxY
        }
        checkTopLeft();
        checkBottomRight();
      }
      restoreOffscreenElement();
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
      const [offsetX, offsetY] = [mouseDownCoords.x, mouseDownCoords.y];
      element.style.transform = `translate3d(${clientX + offsetX}px, ${clientY + offsetY}px, 0)`;
    }
    window.addEventListener('mousemove', dragElement);
    window.addEventListener('touchmove', dragElement);
    return () => {
      window.removeEventListener('mousemove', dragElement);
      window.removeEventListener('touchmove', dragElement);
    }
  }, [element, dragging, mouseDownCoords]);
  const getCoords = (e) => {
    const { clientX, clientY } = (e.type === 'touchstart') ? e.touches[0] : e;
    const { x: elementX, y: elementY } = element.getBoundingClientRect();
    setMouseDownCoords({
      x: elementX - clientX,
      y: elementY - clientY
    });
  }
  return {
    initDragonDrop: getCoords
  }
}

export default useDragonDrop;