import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture } from "@utils";

const objects = ['donttouch'];

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('stormy', sceneComponents);
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 1 );
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
}

export default {
  load,
  objects
}