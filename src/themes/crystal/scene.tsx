import React from "react";
import * as THREE from "three";
import { IObjectComponentProps, SceneObject } from "@types";
import { Model } from "@components";

export const Crystal: React.FC<IObjectComponentProps> = ({ name, sceneComponents }): JSX.Element => {
  const filename = 'crystal.gltf';

  const configObject = (object: SceneObject): void => {
    object.position.set(0, 0, 2.5);
    object.userData.tick = (delta) => {
      object.rotation.y += (delta / 2);
    }
    sceneComponents.loop?.add(object);
  }

  const configChildMeshes = (obj) => {
    Object.assign(obj.material, {
      ior: 2.3,
      roughness: 0,
      metalness: 0,
      color: new THREE.Color('#00FFFF'),
      reflectivity: 0.2,
      transmission: 1,
      clearcoat: 1,
      clearcoatRoughness: 1,
    });
  }

  return (
    <Model {...{
      ...sceneComponents,
      name,
      filename,
      configObject,
      configChildMeshes
    }} />
  )

}