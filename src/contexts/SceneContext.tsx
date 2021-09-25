import React, { useState } from "react";
import { useRenderComponents, useSceneComponents, useTheme } from "@hooks";
import { ISceneContext } from "@types";

export const SceneContext = React.createContext<ISceneContext>(null);

export const SceneContextProvider: React.FC = ({ children }): JSX.Element => {
  const [sceneContainer, setSceneContainer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { fetchedTheme, activeTheme, switchTheme } = useTheme(setLoading);
  const { renderer, loop } = useRenderComponents({ activeTheme, sceneContainer });
  const sceneComponents = useSceneComponents({ activeTheme, renderer, loop });

  const context: ISceneContext = {
    activeTheme, switchTheme,
    loading, setLoading,
    setSceneContainer,
    sceneComponents
  }

  return (
    <SceneContext.Provider value={context}>
      {fetchedTheme && children}
    </SceneContext.Provider>
  )
}