import React from "react";
import * as THREE from "three";
import { Backdrop, Scene } from "@components";
import { addCameraControls, addWater } from "./scene";
import { addEnvironmentTexture } from "@utils";
import { IThreeScene } from "@types";

const loadScene = (sceneComponents: IThreeScene) => {
  const { scene, camera, loop } = sceneComponents;
  camera.position.set(0, 0, 10);

  addEnvironmentTexture('pinksunset', sceneComponents);
  addWater(scene, loop);

  //lighting
  const primaryLight = new THREE.DirectionalLight(0xffffff, 1);
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);

  addCameraControls(sceneComponents);
}

const load = () => {
  return (
    <Backdrop>
      <Scene objects={['oracle']} load={loadScene} />
    </Backdrop>
  )
}

export default {
  load
}