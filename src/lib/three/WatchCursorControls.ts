import * as THREE from "three";
import { ISimpleObject, SceneObject } from "@types";

class WatchCursorControls extends THREE.EventDispatcher {

  isConnected: boolean;
  objects: { [objectName: string]: SceneObject };
  userData: ISimpleObject;
  add: (object: SceneObject) => void;
  connect: () => void;
  disconnect: () => void;
	
	constructor(camera: THREE.Camera) {
    
    super();
    
    this.isConnected = false;
    this.objects = {};
    this.userData = {};

    let objects = Object.values(this.objects);

    const handleMouseMove = (e: MouseEvent | TouchEvent): void => {
      let mouseX, mouseY;
      if (e.type === 'touchmove') {
        mouseX = (e as TouchEvent).touches[0].pageX;
        mouseY = (e as TouchEvent).touches[0].pageY;
      } else {
        mouseX = (e as MouseEvent).clientX;
        mouseY = (e as MouseEvent).clientY;
      }
      // btw this stops working properly if you change the camera position/quaternion
      if (!objects.length) return;
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const pointOfIntersection = new THREE.Vector3();
      mouse.x = (mouseX / window.innerWidth) * 2 - 1;
      mouse.y = - (mouseY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, pointOfIntersection);
      pointOfIntersection.z = camera.position.z;
      objects.forEach(object => {
        object.lookAt(pointOfIntersection);
      });
    }

    this.add = (object: SceneObject): void => {
      this.objects[object.name] = object;
      objects = Object.values(this.objects);
    }

    this.connect = (): void => {
      if (this.isConnected) return;
      window.addEventListener('mousemove', handleMouseMove, false);
      window.addEventListener('touchmove', handleMouseMove, false);
      this.isConnected = true;
    }
    
    this.disconnect = (): void => {
      if (!this.isConnected) return;
      window.removeEventListener('mousemove', handleMouseMove, false);
      window.removeEventListener('touchmove', handleMouseMove, false);
      this.isConnected = false;
    }

	}

}

export default WatchCursorControls;