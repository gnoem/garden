import React from "react";
import * as backdropStyles from "./css/backdrop.module.css";
import { Backdrop, Scene } from "@components";
import { addCameraControls, addLighting, addWater } from "./scene";
import { addEnvironmentTexture, addWatchCursor } from "@utils";
import { IThreeScene } from "@types";

const loadScene = (sceneComponents: IThreeScene) => {
  const { scene, camera, renderer, loop } = sceneComponents;
  addLighting(scene);
  addWater(scene, loop);
  addEnvironmentTexture('pinksunset.hdr', sceneComponents);
  addCameraControls(scene, camera, renderer, loop);
  addWatchCursor(scene, camera);
}

const load = () => {
  return (
    <Backdrop styles={backdropStyles}>
      <Scene objects={['oracle']} load={loadScene} />
    </Backdrop>
  )
}

export default {
  load
}