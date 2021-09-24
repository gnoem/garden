import React, { useState, useEffect, useContext } from "react";
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

  const { setSceneContainer, isSet, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);
  const { scene, camera, renderer } = sceneComponents;

  // ready states
  const { rollCallEnabled, allObjectsLoaded } = useObjectRollCall(objects, { sceneComponents });
  
  useEffect(() => { // prepare scene before loading any objects
    if (!isSet || !rollCallEnabled) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    setReady(true);
  }, [isSet, rollCallEnabled]);

  useEffect(() => {
    if (allObjectsLoaded) {
      const delay = 500; // some wiggle room
      setTimeout(() => {
        setLoading(false)
      }, delay);
    }
  }, [allObjectsLoaded]);

  const createObjects = ([objectName, Object]): JSX.Element | null => {
    if (!(scene && camera && renderer) || !ready) return null;
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

  return (
    <div ref={setSceneContainer} data-scene className={`${loading ? 'loading' : ''}`}>
      {Object.entries(objects).map(createObjects)}
    </div>
  )
}

export default Scene;