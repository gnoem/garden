import React, { useState, useEffect, useContext } from "react";
import { SceneContext } from "@contexts";
import { Crystal, DontTouch, HandleWithCare, Oracle } from "@models";
import { IObjectComponentProps, ISceneContext, IThreeScene } from "@types";
import { useVerifyLoaded } from "./hooks";
import { addWatchCursor } from "@utils";

export interface ILoadedObject {
  name: string;
  loaded: boolean;
}

const objectsMap: { [objectName: string]: React.FC<IObjectComponentProps> } = {
  'oracle': Oracle,
  'crystal': Crystal,
  'donttouch': DontTouch,
  'handlewithcare': HandleWithCare
}

interface IScene {
  objects: string[];
  load: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects: objectNames, load }): JSX.Element => {
  const [ready, setReady] = useState<boolean>(false);

  const { setSceneContainer, isSet, activeTheme, loading, setLoading, sceneComponents } = useContext<ISceneContext>(SceneContext);
  const { setLoaded } = useVerifyLoaded(objectNames, { activeTheme, loading, setLoading });
  
  useEffect(() => { // prepare scene before loading any objects
    if (!isSet) return;
    // add effects
    addWatchCursor(sceneComponents);
    // load theme lighting, env, effects, etc
    load?.(sceneComponents);
    // make setLoaded function available to scene children so they can "announce" when they're loaded
    sceneComponents.scene.userData.setLoaded = setLoaded;
    setReady(true);
  }, [isSet]);

  const createObjects = (objectName: string): JSX.Element | null => {
    const { scene, camera, renderer } = sceneComponents;
    if (!(scene && camera && renderer) || !ready) return null;
    const Element: React.FC<IObjectComponentProps> = objectsMap[objectName];
    if (!Element) {
      console.warn(`you forgot to add ${objectName} to objectsMap!`);
      return null;
    } else {
      return (
        <Element {...{
          key: objectName,
          name: objectName,
          sceneComponents
        }} />
      )
    }
  }

  return (
    <div ref={setSceneContainer} data-scene className={`${loading ? 'loading' : ''}`}>
      {objectNames.map(createObjects)}
    </div>
  )
}

export default Scene;