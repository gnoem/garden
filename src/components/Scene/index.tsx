import React, { useState, useEffect, useContext } from "react";
import { SceneContext } from "@contexts";
import { Crystal, DontTouch, Oracle } from "@models";
import { IObjectComponentProps, ISceneContext, IThreeScene } from "@types";
import { useVerifyLoaded } from "./hooks";

export interface ILoadedObject {
  name: string;
  loaded: boolean;
}

const objectsMap: { [objectName: string]: React.FC<IObjectComponentProps> } = {
  'oracle': Oracle,
  'crystal': Crystal,
  'donttouch': DontTouch
}

interface IScene {
  objects: string[];
  load: (sceneComponents: IThreeScene) => void;
}

const Scene: React.FC<IScene> = ({ objects: objectNames, load }): JSX.Element => {
  const [ready, setReady] = useState<boolean>(false);
  const { setSceneContainer, isSet, sceneComponents, themeContext } = useContext<ISceneContext>(SceneContext);
  const { setLoaded } = useVerifyLoaded(objectNames, themeContext);

  useEffect(() => {
    if (!isSet) return;
    // load theme lighting, environment, effects, etc.
    load?.(sceneComponents);
    // make setLoaded function available to scene children so they can "announce" when they're loaded
    sceneComponents.scene.userData.setLoaded = setLoaded;
    setReady(true);
  }, [isSet]);

  const createObjects = (objectName: string): JSX.Element | null => {
    if (!(isSet && ready)) return null;
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
    <div ref={setSceneContainer} data-scene className={`${themeContext.loading ? 'loading' : ''}`}>
      {objectNames.map(createObjects)}
    </div>
  )
}

export default Scene;