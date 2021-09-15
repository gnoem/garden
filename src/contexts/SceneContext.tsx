import React, { useState, useEffect } from "react";
import { useRenderComponents, useSceneComponents, useTheme } from "@hooks";
import { ISceneContext } from "@types";

export const SceneContext = React.createContext<ISceneContext>(null);

export const SceneContextProvider: React.FC = ({ children }): JSX.Element => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const [sceneContainer, setSceneContainer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { activeTheme } = useTheme(null, setLoading);
  const { renderer, loop, setLoop } = useRenderComponents(sceneContainer);
  const sceneComponents = useSceneComponents({ isSet, setIsSet, renderer, loop, setLoop });
  
  useEffect(() => {
    loop?.dispose();
    if (isSet) setIsSet(false);
  }, [activeTheme]);

  const context: ISceneContext = {
    activeTheme,
    isSet, setIsSet,
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