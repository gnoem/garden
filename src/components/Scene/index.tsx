import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { SceneContext } from "@contexts";
import { ISceneContext, ISceneObjectsMap, IThreeScene } from "@types";
import { useObjectRollCall } from "./hooks";
import { addWatchCursor } from "@utils";

interface IScene {
  objects: ISceneObjectsMap;
  loadTheme: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects, loadTheme }): JSX.Element => {

  const { setSceneContainer, isSet, activeTheme, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);
  const { scene, camera, renderer } = sceneComponents;
  
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const { rollCallEnabled, allObjectsLoaded } = useObjectRollCall(objects, { sceneComponents });

  // all of these need to be true before we can start loading objects
  const readyStates = [
    isSet,
    scene && camera && renderer,
    sceneReady,
    rollCallEnabled
  ]

  const ready = useMemo(() => readyStates.every(Boolean), readyStates);

  useEffect(() => {
    if (sceneReady) setSceneReady(false);
  }, [activeTheme]);

  useEffect(() => { // prepare scene before loading any objects
    if (!isSet || sceneReady) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    setSceneReady(true);
  }, [isSet, sceneReady]);

  // "lift the curtain" when all objects have loaded
  useEffect(() => {
    if (allObjectsLoaded) {
      const delay = 500; // some wiggle room
      setTimeout(() => {
        setLoading(false)
      }, delay);
    }
  }, [allObjectsLoaded]);

  const loadSceneObjects = useCallback(() => {
    const createObjectComponents = ([objectName, Object]): JSX.Element | null => {
      if (!Object) {
        console.error(`could not load ${objectName} due to missing component!`);
        return null;
      } else return (
        <Object {...{
          key: objectName,
          name: objectName,
          sceneComponents
        }} />
      )
    }
    return Object.entries(objects).map(createObjectComponents);
  }, [objects, sceneComponents]);

  return (
    <div ref={setSceneContainer} data-scene className={`${loading ? 'loading' : ''}`}>
      {ready && loadSceneObjects()}
    </div>
  )
}

export default Scene;