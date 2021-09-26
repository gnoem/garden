import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { SceneContext } from "@contexts";
import { ISceneObjectsMap, IThreeScene } from "@types";
import { useObjectRollCall } from "./hooks";
import { addWatchCursor } from "@utils";
import { usePrevious } from "@hooks";

interface IScene {
  objects: ISceneObjectsMap;
  loadTheme: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects, loadTheme }): JSX.Element => {

  const { setLoading, sceneComponents } = useContext(SceneContext)!;
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const { rollCallEnabled, allObjectsLoaded } = useObjectRollCall(objects, sceneComponents);

  // what needs to be true before we can start loading objects
  const readyStates = [
    sceneReady,
    rollCallEnabled
  ]

  const ready = useMemo(() => readyStates.every(Boolean), readyStates);

  const prevScene = usePrevious(sceneComponents.scene);
  const newScene = prevScene?.uuid === sceneComponents.scene?.uuid;

  useEffect(() => {
    if (!newScene) return;
    if (sceneReady) setSceneReady(false);
  }, [newScene]);

  useEffect(() => { // prepare scene before loading any objects
    if (sceneReady || !newScene) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    setSceneReady(true);
  }, [sceneReady, newScene]);

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
    <>
      {ready && loadSceneObjects()}
    </>
  )
}

export default Scene;