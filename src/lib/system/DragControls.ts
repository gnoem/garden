//https://stackoverflow.com/questions/66191751/changing-three-js-orbit-controls-target-when-camera-moves-not-working-good
//https://codepen.io/adelriosantiago/pen/OJbWBep?editors=1010

import { ISimpleObject } from "@types";
import * as THREE from "three";

interface IMouseCoords {
  x: number;
  y: number;
}

type Mouse = IMouseCoords | null;

class DragControls {

  camera: THREE.Camera;
  userData: {
    tick: () => void;
    resetTarget?: (target: THREE.Vector3) => any;
  }
  canvas: HTMLCanvasElement;
  mouse: Mouse;
  mouseMove: boolean;
  mouseDelta: Mouse;
  enableTranslation: boolean;
  translationSpeed: number;
  enableRotation: boolean;
  rotationSpeed: number;
  update: () => void;

  constructor(camera: THREE.Camera, renderer: THREE.WebGLRenderer, config?: ISimpleObject) {
    this.camera = camera;
    this.canvas = renderer.domElement;
    this.userData = {
			tick: (): void => this.update()
		}
    this.mouse = null;
    this.mouseMove = false;
    this.mouseDelta = null;
    this.enableTranslation = true;
    this.translationSpeed = 1;
    this.enableRotation = true;
    this.rotationSpeed = 1;
    this.update = (): void => {}

    const recordMouseEvent = (e: MouseEvent): Mouse => {
      return {
        x: (e.clientX / this.canvas.clientWidth) * 2 - 1,
        y: -(e.clientY / this.canvas.clientHeight) * 2 + 1
      }
    }

    const calculateMouseDelta = (oldMouse: Mouse, newMouse: Mouse): Mouse => {
      if (!oldMouse || !newMouse) return null;
      const mouseToReturn: Mouse = {
        x: newMouse.x - oldMouse.x,
        y: newMouse.y - oldMouse.y
      }
      return mouseToReturn;
    }

    const handleMouseDown = (e: MouseEvent): void => {
      // mouse down
      this.mouse = recordMouseEvent(e);
      
    }

    const handleMouseMove = (e: MouseEvent): void => {
      // mouse move
      if (!this.mouse) return;
      this.mouseMove = true;
      
      const newMouse = recordMouseEvent(e);
      const delta = calculateMouseDelta(this.mouse, newMouse);

      if (!delta) return;

      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      direction.add(new THREE.Vector3(0, 0, 1));
      const d = (delta.x > 0) ? -1 : 1;
      this.camera.rotation.y -= (d * 0.05 * this.rotationSpeed);
      this.mouse = newMouse;
    }

    const handleMouseUp = () => {
      // mouse up
      this.mouse = null;
      this.mouseDelta = null;
    }

    const handleWheel = (e: WheelEvent) => {
      // move forward
      if (!e.deltaY) return;
      const factor = (e.deltaY < 1) ? -1 : 1;
      this.camera.translateZ(factor * this.translationSpeed);
      console.log(this.camera.position);
      if (config?.orbitCenter) {
        config.orbitCenter = this.camera.position;
      }
      //this.userData.resetTarget?.(this.camera.position);
    }

    this.canvas.addEventListener('mousedown', handleMouseDown);
    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseup', handleMouseUp);
    this.canvas.addEventListener('wheel', handleWheel);

    this.update();
  }
}

export default DragControls;