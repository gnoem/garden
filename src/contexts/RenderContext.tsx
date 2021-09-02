import { Loop } from "@lib";
import { IRenderContext } from "@types";
import React, { useState } from "react";
import { useEffect } from "react";
import * as THREE from "three";

export const RenderContext = React.createContext<IRenderContext>({
  loop: null,
  setLoop: null,
  renderer: null,
  setRenderer: null
});

export const RenderContextProvider: React.FC = ({ children }): JSX.Element => {
  const [loop, setLoop] = useState<Loop | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const context: IRenderContext = {
    loop, setLoop,
    renderer, setRenderer
  }
  useEffect(() => {
    const handleClick = () => {
      console.log(context)
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <RenderContext.Provider value={context}>
      {children}
    </RenderContext.Provider>
  )
}