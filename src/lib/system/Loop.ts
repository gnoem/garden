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
  isRunning: boolean;

  constructor(scene: THREE.Scene | null, camera: THREE.Camera | null, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    if (!this.isRunning) {
      this.renderer.setAnimationLoop((): void => {
        this.tick();
        this.renderer.render(this.scene, this.camera);
      });
      this.isRunning = true;
    }
  }

  stop() {
    if (this.isRunning) {
      this.renderer.setAnimationLoop(null);
      this.isRunning = false;
    }
  }

  dispose() {
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