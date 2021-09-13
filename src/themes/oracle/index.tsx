import React from "react";
import { Backdrop, Scene } from "@components";
import { addCameraControls, addLighting, addWater } from "./scene";
import { addEnvironmentTexture } from "@utils";
import { IThreeScene } from "@types";

const loadScene = (sceneComponents: IThreeScene) => {
  const { scene, camera, renderer, loop } = sceneComponents;
  camera.position.set(0, 0, 10);
  addLighting(scene);
  addWater(scene, loop);
  addEnvironmentTexture('pinksunset.hdr', sceneComponents);
  addCameraControls(scene, camera, renderer, loop);
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