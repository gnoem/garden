import * as THREE from "three";
import { CameraControls } from "@lib";
import { SceneObject } from "@types";

type Updatable = SceneObject | CameraControls;

const clock = new THREE.Clock();

class Loop {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  updatables: Updatable[];
  isLooping: boolean;

  constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.isLooping = false;
  }

  start() {
    if (!this.isLooping) {
      clock.start();
      this.renderer.setAnimationLoop((): void => {
        this.tick();
        this.renderer.render(this.scene, this.camera);
      });
      this.isLooping = true;
    }
  }

  stop() {
    if (this.isLooping) {
      clock.stop();
      this.renderer.setAnimationLoop(null);
      this.isLooping = false;
    }
  }

  dispose() {
    console.log('disposing');
    this.updatables = [];
  }

  add(obj: Updatable) {
    this.updatables.push(obj);
  }
  
  tick() {
    const delta = clock.getDelta();
    for (const object of this.updatables) {
      object.userData.tick?.(delta);
    }
  }
}

export default Loop;