import React from "react";
import * as THREE from "three";
import { Water } from "@lib";
import { ILoop, IObjectComponentProps, SceneObject } from "@types";
import { Model } from "@components";

export const Oracle: React.FC<IObjectComponentProps> = ({ name, sceneComponents }): JSX.Element => {

  const configObject = (object: SceneObject): void => {
    object.position.set(0, 1.5, 2);
    sceneComponents.scene?.userData.enableWatchCursor?.(object);
    sceneComponents.loop?.add(object);
  }

  return (
    <Model {...{
      ...sceneComponents,
      name,
      filename: 'oracle.glb',
      configObject
    }} />
  )
  
}

export const addWater = (scene: THREE.Scene, loop: ILoop): Water => {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    normalSampler: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture: THREE.Texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: new THREE.Color(0xffffff),
    waterColor: new THREE.Color(0x001e0f),
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  });

  water.position.y = -5;
  water.rotation.x = -Math.PI / 2;
  const waterMaterial = water.material;
  water.userData.tick = () => {
    waterMaterial.uniforms['time'].value += 1.0 / 60.0;
  }

  loop.add(water);
  scene.add(water);

  return water;
}