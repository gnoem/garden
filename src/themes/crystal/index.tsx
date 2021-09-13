import React from "react";
import * as THREE from "three";
import * as backdropStyles from "./css/backdrop.module.css";
import { Backdrop, Scene } from "@components";
import { IThreeScene } from "@types";
import { addEnvironmentTexture, addWatchCursor } from "@utils";

const loadScene = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('hellscape.hdr', sceneComponents);
  addWatchCursor(scene, camera);
  const primaryLight = new THREE.DirectionalLight( 0xffff00, 1 );
  primaryLight.position.set(50, 0, 0);
  primaryLight.shadow.bias = 0.001;
  primaryLight.shadow.normalBias = 0.003;
  scene.add(primaryLight);
}

const load = () => {
  return (
    <Backdrop styles={backdropStyles}>
      <Scene objects={['crystal']} load={loadScene} />
    </Backdrop>
  )
}

export default {
  load,
  className: 'oracle'
}