import { preventTransformOffscreen } from "@utils";
import { useEffect, useState } from "react";

const boxEdges = ({ top, bottom, left, right }) => {
  const threshold = {
    inner: 4,
    outer: 6,
    innerCorner: 10
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

const useResizeWindow = (localRef) => {
  const [edge, setEdge] = useState<string | undefined>(null);
  const [anchoredEdge, setAnchoredEdge] = useState<string | undefined>(null);
  const [originalRect, setOriginalRect] = useState<ClientRect | undefined>(localRef?.getBoundingClientRect());
  const [mouseDownCoords, setMouseDownCoords] = useState<{ x: number; y: number; } | undefined>(null);
  const [minimumDimensions, setMinimumDimensions] = useState<{ width: number; height: number; } | undefined>(null);
  // get minimum dimensions from localRef:
  useEffect(() => {
    if (!localRef) return;
    const { minWidth, minHeight } = localRef.dataset;
    setMinimumDimensions({
      width: minWidth ?? 200,
      height: minHeight ?? 200
    });
  }, [localRef]);
  // set up initial mouseup, mousedown, mousemove listeners:
  useEffect(() => {
    if (!localRef) return;
    const handleMouseUp = () => {
      setMouseDownCoords(null);
      if (anchoredEdge) {
        // make sure to set the new window transform based on x, y coords *at time of mouseup*
        // necessary if dragging from any edge/corner except for E, SE, and S
        const { x, y, width, height } = localRef.getBoundingClientRect();
        localRef.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        preventTransformOffscreen(localRef, { x, y }, {
          x: window.innerWidth - (width / 2),
          y: window.innerHeight - (height / 3)
        });
        setAnchoredEdge(null);
      }
    }
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (edge) setMouseDownCoords({ x: e.clientX, y: e.clientY });
    }
    const handleMouseMove = (e) => {
      e.preventDefault();
      if (mouseDownCoords) return;
      const { clientX, clientY } = e;
      setOriginalRect(localRef.getBoundingClientRect());
      const edges = boxEdges(localRef.getBoundingClientRect());
      // for each edge, check if clientX is in edge.x and clientY is in edge.y
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
          if (edge !== foundEdge) setEdge(foundEdge);
        }
      }
      //if (mouseDownCoords) setDragging(true);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [localRef, mouseDownCoords, anchoredEdge, edge]);
  // while edge is active, set cursor and disable pointer events:
  useEffect(() => {
    document.body.style.cursor = edgeConfig[edge]?.cursorName ?? 'default';
    if (localRef) {
      Array.from(localRef.children).forEach((child: HTMLElement) => {
        child.style.pointerEvents = edge ? 'none' : '';
      });
    }
  }, [localRef, edge]);
  // adjust for the fact that, unless dragging from E, SE, or S edge, window position must be based on NOT the top left corner:
  useEffect(() => {
    if (!localRef) return;
    if (!anchoredEdge) {
      for (const property of ['top', 'left', 'bottom', 'right']) {
        localRef.style[property] = '';
      }
      return;
    }
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
            const { transform } = window.getComputedStyle(localRef);
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
        localRef.style[property] = `${getTempValue()}px`;
        // then set new transform!!
      }
      for (const property of unset) {
        localRef.style[property] = 'unset';
      }
    }
  }, [localRef, anchoredEdge]);
  // actual drag and resize:
  useEffect(() => {
    if (!localRef) return;
    const startDragging = (e) => {
      e.preventDefault();
      if (!mouseDownCoords || !edgeConfig[edge]) return;
      const { clientX, clientY } = e;
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
            localRef.style[dimension] = `${newValues[dimension]}px`;
          }
        }
      }
      resize();
    }
    window.addEventListener('mousemove', startDragging);
    return () => window.removeEventListener('mousemove', startDragging);
  }, [localRef, mouseDownCoords, originalRect, edge]);
}

export default useResizeWindow;