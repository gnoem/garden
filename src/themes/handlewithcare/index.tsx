import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture } from "@utils";
import { PointerOrbitControls } from "@lib";
import { OrbitControls } from "@lib/three/OrbitControls";

const objects = ['handlewithcare'];

const addPointerOrbitControls = ({ camera, renderer, loop }) => {
  const controls = new PointerOrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.minAzimuthAngle = -Math.PI * 0.25;
  controls.maxAzimuthAngle = Math.PI * 0.25;
  controls.rotateSpeed = 0.02;
  controls.connect();
  loop.add(controls);
  return controls;
}

const addOrbitControls = ({ camera, renderer, loop }) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.minAzimuthAngle = -Math.PI * 0.25;
  controls.maxAzimuthAngle = Math.PI * 0.25;
  controls.rotateSpeed = 0.03;
  controls.minDistance = 7;
  controls.maxDistance = 22;
  loop.add(controls);
  controls.connect();
  return controls;
}

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('pinkclouds', sceneComponents);
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 1 );
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
  //addPointerOrbitControls(sceneComponents);
  addOrbitControls(sceneComponents);
}

export default {
  load,
  objects
}