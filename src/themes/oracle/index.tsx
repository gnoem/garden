import * as THREE from "three";
import { addWater } from "./scene";
import { addEnvironmentTexture } from "@utils";
import { IThreeScene } from "@types";

const objects = ['oracle'];

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera, loop } = sceneComponents;
  camera.position.set(0, 0, 10);

  addEnvironmentTexture('pinksunset', sceneComponents);
  addWater(scene, loop);

  //lighting
  const primaryLight = new THREE.DirectionalLight(0xffffff, 1);
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
}

export default {
  objects,
  load
}