import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture } from "@utils";
import { OrbitControls } from "@lib";

const objects = ['handlewithcare'];

const addOrbitControls = ({ camera, renderer, loop }) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.minAzimuthAngle = -Math.PI * 0.25;
  controls.maxAzimuthAngle = Math.PI * 0.25;
  controls.rotateSpeed = 0.02;
  controls.minDistance = 7;
  controls.maxDistance = 22;
  controls.enableMousePan = false;
  controls.enableMouseZoom = false;
  controls.speedTouchRotation = 10;
  controls.setDragToRotate(false);
  loop.add(controls);
  controls.connect();
  return controls;
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