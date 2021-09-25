import React, { useState, useEffect, useContext, useCallback } from "react";
import { SceneContext } from "@contexts";
import { ISceneContext, ISceneObjectsMap, IThreeScene } from "@types";
import { useObjectRollCall } from "./hooks";
import { addWatchCursor } from "@utils";

interface IScene {
  objects: ISceneObjectsMap;
  loadTheme: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects, loadTheme }): JSX.Element => {
  const [ready, setReady] = useState<boolean>(false);

  const { setSceneContainer, isSet, activeTheme, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);

  const { rollCallEnabled, allObjectsLoaded } = useObjectRollCall(objects, { sceneComponents });

  useEffect(() => {
    if (ready) setReady(false);
  }, [activeTheme]);

  useEffect(() => { // prepare scene before loading any objects
    if (!isSet || ready) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    setReady(true);
  }, [isSet, ready]);

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
      {(ready && rollCallEnabled) && loadSceneObjects()}
    </div>
  )
}

export default Scene;