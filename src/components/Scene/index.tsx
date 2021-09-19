import React, { useState, useEffect, useContext } from "react";
import { SceneContext } from "@contexts";
import { ISceneContext, ISceneObjectsMap, IThreeScene } from "@types";
import { useVerifyLoaded } from "./hooks";
import { addWatchCursor } from "@utils";

export interface ILoadedObject {
  name: string;
  loaded: boolean;
}

interface IScene {
  objects: ISceneObjectsMap;
  loadTheme: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects, loadTheme }): JSX.Element => {
  const [ready, setReady] = useState<boolean>(false);

  const { setSceneContainer, isSet, activeTheme, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);
  const { setLoaded } = useVerifyLoaded(objects, { activeTheme, loading, setLoading });
  const { scene, camera, renderer } = sceneComponents;
  
  useEffect(() => { // prepare scene before loading any objects
    if (!isSet) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    loadTheme?.(sceneComponents);
    // make setLoaded function available to scene children so they can "announce" when they're loaded
    sceneComponents.scene.userData.setLoaded = setLoaded;
    setReady(true);
  }, [isSet]);

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