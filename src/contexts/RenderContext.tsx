import React, { useState } from "react";
import * as THREE from "three";
import { Loop } from "@lib";
import { IRenderContext } from "@types";
import { useTheme } from "@hooks";
import { useEffect } from "react";

export const RenderContext = React.createContext<IRenderContext>(null);

export const RenderContextProvider: React.FC = ({ children }): JSX.Element => {
  const { activeTheme } = useTheme();
  const [loop, setLoop] = useState<Loop | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  
  useEffect(() => {
    loop?.dispose();
  }, [activeTheme]);
  
  const context: IRenderContext = {
    activeTheme,
    loop, setLoop,
    renderer, setRenderer
  }

  return (
    <RenderContext.Provider value={context}>
      {children}
    </RenderContext.Provider>
  )
}