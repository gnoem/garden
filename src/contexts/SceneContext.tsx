import React, { useState, useEffect } from "react";
import { useRenderComponents, useSceneComponents, useTheme } from "@hooks";
import { ISceneContext } from "@types";

export const SceneContext = React.createContext<ISceneContext>(null);

export const SceneContextProvider: React.FC = ({ children }): JSX.Element => {
  const [sceneIsSet, setSceneIsSet] = useState<boolean>(false);
  const [sceneContainer, setSceneContainer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { activeTheme, switchTheme } = useTheme(setLoading);
  const { renderer, loop } = useRenderComponents(sceneContainer);
  const sceneComponents = useSceneComponents({ sceneIsSet, setSceneIsSet, renderer, loop });
  
  useEffect(() => {
    loop?.dispose();
    if (sceneIsSet) {
      setSceneIsSet(false);
    }
  }, [activeTheme]);

  const context: ISceneContext = {
    activeTheme,
    switchTheme,
    sceneIsSet, setSceneIsSet,
    loading, setLoading,
    setSceneContainer,
    sceneComponents
  }

  return (
    <SceneContext.Provider value={context}>
      {children}
    </SceneContext.Provider>
  )
}