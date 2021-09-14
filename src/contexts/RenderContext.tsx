import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Loop } from "@lib";
import { IRenderContext } from "@types";
import { useTheme } from "@hooks";

export const RenderContext = React.createContext<IRenderContext>(null);

export const RenderContextProvider: React.FC = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loop, setLoop] = useState<Loop | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  
  const { activeTheme } = useTheme(renderer?.domElement, setLoading);
  
  useEffect(() => {
    loop?.dispose();
  }, [activeTheme]);

  const context: IRenderContext = {
    activeTheme,
    loading, setLoading,
    loop, setLoop,
    renderer, setRenderer
  }

  return (
    <RenderContext.Provider value={context}>
      {children}
    </RenderContext.Provider>
  )
}