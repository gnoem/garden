import { usePrevious } from "@hooks";
import { preventTransformOffscreen } from "@utils";
import { useEffect, useState } from "react";

const boxEdges = ({ top, bottom, left, right }) => {
  const threshold = { // todo either clean this up or figure out how to save outer threshold
    inner: 7,
    outer: 6,
    innerCorner: 15
  }
  return {
    N: {
      x: [left - threshold.outer, right + threshold.outer],
      y: [top - threshold.outer, top + threshold.inner]
    },
    E: {
      x: [right - threshold.inner, right + threshold.outer],
      y: [top - threshold.outer, bottom + threshold.outer]
    },
    S: {
      x: [left - threshold.outer, right + threshold.outer],
      y: [bottom - threshold.inner, bottom + threshold.outer]
    },
    W: {
      x: [left - threshold.outer, left + threshold.inner],
      y: [top - threshold.outer, bottom + threshold.outer]
    },
    NW: {
      x: [left - threshold.outer, left + threshold.innerCorner],
      y: [top - threshold.outer, top + threshold.innerCorner]
    },
    NE: {
      x: [right - threshold.innerCorner, right + threshold.outer],
      y: [top - threshold.outer, top + threshold.innerCorner]
    },
    SE: {
      x: [right - threshold.innerCorner, right + threshold.outer],
      y: [bottom - threshold.innerCorner, bottom + threshold.outer]
    },
    SW: {
      x: [left - threshold.outer, left + threshold.innerCorner],
      y: [bottom - threshold.innerCorner, bottom + threshold.outer]
    }
  }
}

const edgeConfig = {
  N: {
    cursorName: 'ns-resize',
    anchor: ['bottom'],
    unset: ['top'],
    calculateDiff: [1, -1],
    willChange: ['height']
  },
  E: {
    cursorName: 'ew-resize',
    calculateDiff: [1, 1],
    willChange: ['width']
  },
  S: {
    cursorName: 'ns-resize',
    calculateDiff: [1, 1],
    willChange: ['height']
  },
  W: {
    cursorName: 'ew-resize',
    anchor: ['right'],
    unset: ['left'],
    calculateDiff: [-1, 1],
    willChange: ['width']
  },
  NW: {
    cursorName: 'nwse-resize',
    anchor: ['bottom', 'right'],
    unset: ['top', 'left'],
    calculateDiff: [-1, -1],
    willChange: ['width', 'height']
  },
  NE: {
    cursorName: 'nesw-resize',
    anchor: ['bottom', 'left'],
    unset: ['top'],
    calculateDiff: [1, -1],
    willChange: ['width', 'height']
  },
  SE: {
    cursorName: 'nwse-resize',
    calculateDiff: [1, 1],
    willChange: ['width', 'height']
  },
  SW: {
    cursorName: 'nesw-resize',
    anchor: ['top', 'right'],
    unset: ['left'],
    calculateDiff: [-1, 1],
    willChange: ['width', 'height']
  },
}

interface ITarget {
  edge: string;
  name: string;
  element: HTMLElement;
}

/**
 * Allows us to resize our HTML element windows
 * @param windowRefs an object containing all the windows (HTML elements) that should be resizable
 */
const useResizeWindows = (windowRefs: { [key: string]: HTMLElement; }): void => {
  const [mouseDownCoords, setMouseDownCoords] = useState<{ x: number; y: number; } | null>(null);
  const [target, setTarget] = useState<ITarget | null>(null);
  const [anchoredEdge, setAnchoredEdge] = useState<string | null>(null);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);
  const [minimumDimensions, setMinimumDimensions] = useState<{ width: number; height: number; } | null>(null);
  const prevTarget = usePrevious(target);

  /**
   * useEffect runs as soon as a "target element" has been identified
   * Set the minimum dimensions of the target element
   */
  useEffect(() => {
    if (!target?.element) return;
    const { minWidth = '200', minHeight = '200' } = target.element.dataset;
    const [width, height] = [parseInt(minWidth), parseInt(minHeight)];
    setMinimumDimensions({ width, height });
  }, [target?.element]);

  /**
   * useEffect runs whenever windowRefs changes
   * Add a little corner drag icon to each window via the "resizable" CSS class, mainly so it's clear on touchscreens when there's no cursor change to indicate draggableness
   */
  useEffect(() => {
    Object.values(windowRefs).forEach((element: HTMLElement) => {
      if (element.getAttribute('data-resize')) return;
      const arrow = document.createElement('span');
      arrow.setAttribute('data-drag', 'true');
      element.appendChild(arrow);
      element.setAttribute('data-resize', 'true');
    });
  }, [windowRefs]);

  /**
   * SET UP BASIC MOUSEUP & MOUSEDOWN LISTENERS
   * add mousedown listener to store the original size (DOMRect) of the target element and the initial mousedown coordinates
   * add mouseup listener to reset certain states (target element, mousedown coords, & anchored edge) and finalize element transform
   */
  useEffect(() => {
    const handleMouseUp = () => {
      setTarget(null); // NECESSARY FOR DRAGONDROP TO WORK FOR SOME REASON
      setMouseDownCoords(null);
      if (anchoredEdge && target?.element) {
        // make sure to set the new window transform based on x, y coords *at time of mouseup*
        // necessary if dragging from any edge/corner except for E, SE, and S
        const { x, y, width, height } = target.element.getBoundingClientRect();
        target.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        preventTransformOffscreen(target.element, { x, y }, {
          x: window.innerWidth - (width / 2),
          y: window.innerHeight - (height / 3)
        });
        for (const property of ['top', 'left', 'bottom', 'right']) {
          target.element.style[property] = '';
        }
        setAnchoredEdge(null);
      }
    }
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (target) {
        setOriginalRect(target.element.getBoundingClientRect());
        setMouseDownCoords({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    }
  }, [anchoredEdge, target]);

  /**
   * add mousemove event listener to determine if the user is hovering over a window and if so, which edge
   */
  useEffect(() => {
    const handleMouseMove = (e) => { // determine current window, edge and target
      e.preventDefault();
      if (mouseDownCoords) return;
      const touchscreen = e.type === 'touchstart';
      const { clientX, clientY } = touchscreen ? e.touches[0] : e;
      let foundElement; // = currentElement;
      for (const entry of Object.entries(windowRefs)) {
        const [name, element]: [string, HTMLElement] = entry;
        if (element.contains(e.target)) {
          foundElement = { name, element };
          //setCurrentElement(foundElement); // is this just so that on each mousemove event, foundElement doesn't get briefly reset to null
        }
      }
      if (!foundElement) {
        setTarget(null);
        return;
      }
      const detectEdge = ({ name, element }) => {
        const edges = boxEdges(element.getBoundingClientRect());
        const edgeNames = Object.keys(edges);
        let foundEdge;
        for (let i = 0; i < edgeNames.length; i++) {
          const areaName = edgeNames[i];
          const rect = edges[areaName];
          const inX = (clientX > rect.x[0]) && (clientX < rect.x[1]);
          const inY = (clientY > rect.y[0]) && (clientY < rect.y[1]);
          if (inX && inY) {
            foundEdge = areaName;
          }
          const onLastLoop = i === edgeNames.length - 1;
          if (onLastLoop) {
            if (target?.edge !== foundEdge) {
              setTarget(foundEdge ? { edge: foundEdge, name, element } : null);
            }
          }
        }
      }
      const detectBottomRightCorner = ({ name, element }) => {
        const { SE } = boxEdges(element.getBoundingClientRect());
        const radius = 20;
        const [minX, maxX] = [SE.x[0] - radius, SE.x[1] + radius];
        const [minY, maxY] = [SE.y[0] - radius, SE.y[1] + radius];
        const inX = (clientX > minX) && (clientX < maxX);
        const inY = (clientY > minY) && (clientY < maxY);
        if (inX && inY) {
          setTarget({ edge: 'SE', name, element });
          setMouseDownCoords({ x: clientX, y: clientY });
          setOriginalRect(element.getBoundingClientRect());
        }
      }
      if (touchscreen) {
        detectBottomRightCorner(foundElement);
      } else {
        detectEdge(foundElement);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
    }
  }, [windowRefs, mouseDownCoords, target]);

  /**
   * while edge is active, set cursor and disable pointer events
   */
  useEffect(() => {
    const handlePointerBehavior = (element: HTMLElement, activeCursor: string | null): void => {
      document.body.style.cursor = activeCursor ?? '';
      if (!element) return;
      Array.from(element.children).forEach(child => {
        (child as HTMLElement).style.pointerEvents = activeCursor ? 'none' : '';
      });
    }

    if (!target) { // clean up pointer behavior from previous target
      handlePointerBehavior(prevTarget?.element, null);
    } else {
      const cursorName = edgeConfig[target.edge]?.cursorName ?? '';
      handlePointerBehavior(target.element, cursorName);
    }
    
  }, [target?.element, target?.edge, prevTarget]);

  /**
   * adjust for the fact that, unless dragging from E, SE, or S edge, window position must be based on NOT the top left corner
   */
  useEffect(() => {
    if (!target?.element || !anchoredEdge) return;
    if (!originalRect) return;
    const { anchor, unset } = edgeConfig[anchoredEdge];
    if (anchor && unset) {
      for (const property of anchor) {
        const getTempValue = () => {
          let tempValue = originalRect[property];
          const adjustBottomRight = () => {
            if (property === 'bottom') tempValue = window.innerHeight - tempValue;
            if (property === 'right') tempValue = window.innerWidth - tempValue;
          }
          const adjustForTransform = () => {
            const { transform } = window.getComputedStyle(target.element);
            const { e: transformX, f: transformY } = new WebKitCSSMatrix(transform);
            let offset;
            if (property === 'top') offset = -transformY;
            if (property === 'bottom') offset = transformY;
            if (property === 'left') offset = -transformX;
            if (property === 'right') offset = transformX;
            tempValue += offset;
          }
          adjustBottomRight();
          adjustForTransform();
          return tempValue;
        }
        target.element.style[property] = `${getTempValue()}px`;
      }
      for (const property of unset) {
        target.element.style[property] = 'unset';
      }
    }
  }, [target?.element, anchoredEdge]);

  /**
   * THE ACTUAL DRAG-TO-RESIZE PART
   * add mousemove & touchmove listeners to set the window's width and height based on current mouse/touch position
   */
  useEffect(() => {
    if (!minimumDimensions) return;
    const startDragging = (e) => {
      e.preventDefault();
      if (!target) return;
      const { edge, element } = target;
      if (!mouseDownCoords || !edgeConfig[edge] || !originalRect) return;
      const touchscreen = e.type === 'touchmove';
      const { clientX, clientY } = touchscreen ? e.touches[0] : e;
      // figure out new values based on change from mouseDownCoords
      const [dx, dy] = [clientX - mouseDownCoords.x, clientY - mouseDownCoords.y];
      const newValues = {
        width: originalRect.width + (dx * edgeConfig[edge].calculateDiff[0]),
        height: originalRect.height + (dy * edgeConfig[edge].calculateDiff[1])
      }
      const resize = () => {
        setAnchoredEdge(edge);
        for (const dimension of edgeConfig[edge].willChange) {
          if (newValues[dimension] >= minimumDimensions[dimension]) {
            element.style[dimension] = `${newValues[dimension]}px`;
          }
        }
      }
      resize();
    }
    window.addEventListener('mousemove', startDragging);
    window.addEventListener('touchmove', startDragging);
    return () => {
      window.removeEventListener('mousemove', startDragging);
      window.removeEventListener('touchmove', startDragging);
    }
  }, [target, mouseDownCoords, originalRect, minimumDimensions]);
}

export default useResizeWindows;