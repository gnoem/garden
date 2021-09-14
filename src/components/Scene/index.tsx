import React, { useState, useEffect, useContext } from "react";
import { RenderContext } from "@contexts";
import { useScene } from "@hooks";
import { Crystal, DontTouch, Oracle } from "@models";
import { IObjectComponentProps, IRenderContext, IThreeScene } from "@types";
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
  const [sceneRef, createSceneRef] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const renderContext = useContext<IRenderContext>(RenderContext);
  const sceneComponents: IThreeScene = useScene(sceneRef, renderContext, load);
  const { setLoaded } = useVerifyLoaded(objectNames, sceneComponents, renderContext);
  
  useEffect(() => { // prepare scene before loading any objects
    if (!sceneComponents?.scene) return;
    // make setLoaded function available to scene children so they can "announce" when they're loaded
    sceneComponents.scene.userData.setLoaded = setLoaded;
    setReady(true);
  }, [sceneComponents]);

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
    <div ref={createSceneRef} data-scene className={`${renderContext.loading ? 'loading' : ''}`}>
      {objectNames.map(createObjects)}
    </div>
  )
}

export default Scene;