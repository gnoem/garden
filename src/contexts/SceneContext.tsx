import { useCreateScene, useTheme } from "@hooks";
import { Loop } from "@lib";
import * as THREE from "three";
import React, { useState, useEffect } from "react";
import { ISceneContext } from "@types";

export const SceneContext = React.createContext<ISceneContext>(null);

export const SceneContextProvider: React.FC = ({ children }): JSX.Element => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const [sceneContainer, setSceneContainer] = useState<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const { activeTheme } = useTheme(setLoading);

  const renderContext = useRenderContext(sceneContainer);
  const sceneComponents = useCreateScene(renderContext, { isSet, setIsSet });

  useEffect(() => {
    renderContext.loop?.dispose();
    if (isSet) setIsSet(false);
  }, [activeTheme]);
  
  const context: ISceneContext = {
    setSceneContainer,
    isSet,
    sceneComponents,
    themeContext: { activeTheme, loading, setLoading }
  }

  return (
    <SceneContext.Provider value={context}>
      {children}
    </SceneContext.Provider>
  )
}

const useRenderContext = (sceneContainer) => {

  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [loop, setLoop] = useState<Loop | null>(null);

  useEffect(() => {
    if (renderer || !sceneContainer) return;
    const newRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    newRenderer.setPixelRatio(window.devicePixelRatio);
    newRenderer.shadowMap.enabled = true;
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.outputEncoding = THREE.sRGBEncoding;
    setRenderer(newRenderer);
    sceneContainer.appendChild(newRenderer.domElement);
  }, [sceneContainer]);

  const renderContext = {
    loop, setLoop,
    renderer, setRenderer
  }

  return renderContext;
}