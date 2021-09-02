import React, { useState } from "react";
import * as THREE from "three";
import { Loop } from "@lib";
import { IRenderContext } from "@types";

export const RenderContext = React.createContext<IRenderContext>(null);

export const RenderContextProvider: React.FC = ({ children }): JSX.Element => {
  const [loop, setLoop] = useState<Loop | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const context: IRenderContext = {
    loop, setLoop,
    renderer, setRenderer
  }
  return (
    <RenderContext.Provider value={context}>
      {children}
    </RenderContext.Provider>
  )
}