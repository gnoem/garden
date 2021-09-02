import React, { useState, useEffect, useContext } from "react";
import * as styles from "./Scene.module.css";
import { useScene } from "@hooks";
import { Oracle } from "@models";
import { IObjectComponentProps, IRenderContext, IThreeScene } from "@types";
import { useVerifyLoaded } from "./hooks";
import { RenderContext } from "@contexts";

export interface ILoadedObject {
  name: string;
  loaded: boolean;
}

const objectsMap: {
  [objectName: string]: React.FC<IObjectComponentProps>
} = {
  'oracle': Oracle
}

const Scene: React.FC<{ objects: string[]; }> = ({ objects: objectNames }): JSX.Element => {
  const [sceneRef, createSceneRef] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const renderContext = useContext<IRenderContext>(RenderContext)
  console.log(renderContext)
  const sceneComponents: IThreeScene = useScene(sceneRef, renderContext);
  const { loading, setLoaded } = useVerifyLoaded(objectNames, sceneComponents);
  
  useEffect(() => { // prepare scene before loading any objects
    if (!sceneComponents?.scene) return;
    sceneComponents.scene.userData.setLoaded = setLoaded; // make setLoaded function available to scene children
    setReady(true);
  }, [sceneComponents]);

  const createObjects = (objectName: string): JSX.Element | null => {
    const { scene, camera, renderer } = sceneComponents;
    if (!(scene && camera && renderer) || !ready) return null;
    const Element: React.FC<IObjectComponentProps> = objectsMap[objectName];
    const object: JSX.Element = (
      <Element {...{
        key: objectName,
        name: objectName,
        sceneComponents
      }} />
    )
    return object;
  }

  return (
    <div ref={createSceneRef} className={`${styles.Scene} ${loading ? styles.loading : ''}`}>
      {objectNames.map(createObjects)}
    </div>
  )
}

export default Scene;