import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture } from "@utils";
import { addOrbitControls, HandleWithCare } from "./scene";

const objects = {
  'handlewithcare': HandleWithCare
}

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('pinkclouds', sceneComponents);
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
  primaryLight.position.set(0, 20, 0);
  scene.add(primaryLight);
  addOrbitControls(sceneComponents);
}

export default {
  load,
  objects
}