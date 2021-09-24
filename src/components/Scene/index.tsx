import React, { useState, useEffect, useContext, useMemo } from "react";
import { SceneContext } from "@contexts";
import { ISceneContext, ISceneObjectsMap, IThreeScene } from "@types";
import { useVerifyLoaded } from "./hooks";
import { addWatchCursor } from "@utils";

interface IScene {
  objects: ISceneObjectsMap;
  loadTheme: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects, loadTheme }): JSX.Element => {
  const { setSceneContainer, sceneIsSet, activeTheme, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);
  const { scene, camera, renderer } = sceneComponents;

  // ready states
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const sceneSetUpToRegisterObjects = useVerifyLoaded(objects, {
    sceneComponents,
    loading, 
    setLoading
  });

  const readyStates = [
    sceneIsSet,
    (scene && camera && renderer),
    sceneReady,
    sceneSetUpToRegisterObjects,
    // themeReady, eventually
  ];

  // signal to "lift the curtain" (remove the loading screen)
  const liftCurtain = useMemo(() => {
    return readyStates.every(Boolean);
  }, readyStates);

  useEffect(() => {
    setSceneReady(false);
  }, [activeTheme]);
  
  useEffect(() => { // prepare scene before allowing any objects to load
    if (!sceneIsSet || sceneReady) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme-specific lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    setSceneReady(true);
  }, [sceneIsSet, sceneReady]);

  const revealObjects = (): (JSX.Element | null)[] => {
    const createObjectComponents = ([objectName, Object]): (JSX.Element | null) => {
      if (!Object) {
        console.error(`could not load ${objectName} due to missing component!`);
        return null;
      }
      return (
        <Object {...{
          key: objectName,
          name: objectName,
          sceneComponents
        }} />
      )
    }
    return Object.entries(objects).map(createObjectComponents);
  }

  return (
    <div ref={setSceneContainer} data-scene className={`${loading ? 'loading' : ''}`}>
      {liftCurtain && revealObjects()}
    </div>
  )
}

export default Scene;