import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture } from "@utils";
import { Crystal } from "./scene";

const objects = {
  'crystal': Crystal
}

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('hellscape', sceneComponents);
  const primaryLight = new THREE.DirectionalLight( 0x11ff00, 1 );
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
}

export default {
  load,
  objects
}