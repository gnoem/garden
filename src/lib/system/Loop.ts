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

  constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop((): void => {
      this.tick();
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  dispose() {
    this.stop();
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