import React from "react";
import { Model } from "@components";
import { IObjectComponentProps, SceneObject } from "@types";

export const DontTouch: React.FC<IObjectComponentProps> = ({ name, sceneComponents }): JSX.Element => {

  const filename = 'donttouch.gltf';

  const configObject = (object: SceneObject): void => {
    object.position.set(0, -2.75, 5);
    object.userData.tick = (delta) => {
      object.rotation.y -= (delta / 2);
    }
    sceneComponents.loop?.add(object);
  }

  return (
    <Model {...{
      ...sceneComponents,
      name,
      filename,
      configObject
    }} />
  )

}