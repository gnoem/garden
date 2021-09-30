import * as THREE from "three";
import { mutateStateArray } from "@utils";
import { useCallback, useEffect, useState } from "react";
import { ILoop, SceneObject } from "@types";

const clock = new THREE.Clock();

/**
 * Initializes the animation loop that scene objects can be added into/removed from. Handles all the looping logic and the animation system.
 * @param renderer scene renderer
 * @returns loop controller interface
 */
const useLoop = (renderer: THREE.WebGLRenderer): ILoop => {
  const [{ scene, camera }, setLoop] = useState<{ scene: THREE.Scene; camera: THREE.Camera }>({
    scene: null,
    camera: null
  });
  const [updatables, setUpdatables] = useState<SceneObject[]>([]);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  /**
   * Update the loop's scene and camera. Typically called when the scene/camera changes, e.g. on theme switch.
   */
  const set = (scene: THREE.Scene, camera: THREE.Camera): void => {
    setLoop({ scene, camera });
  }

  /**
   * Set isLooping to true, triggering the useEffect that starts our loop
   */
  const start = () => setIsLooping(true);

  /**
   * Set isLooping to false, triggering the useEffect that stops our loop
   */
  const stop = () => setIsLooping(false);

  /**
   * Adds a given object to the loop
   * @param obj scene object to be added to the loop
   */
  const add = (obj: SceneObject) => setUpdatables(mutateStateArray(array => array.push(obj)));

  /**
   * Clear the loop of all scene objects
   * For each object, also call object.userData.disconnect?.() to perform any cleanup that needs to be done, e.g. removing event listeners
   */
  const dispose = (): void => {
    for (const object of updatables) {
      /**
       * object.userData.disconnect may or may not be defined
       * this is primarily for updatables like three.js controls that need cleanup beyond just removing them from the loop
       */
      object.userData.disconnect?.();
    }
    setUpdatables([]);
  }

  /**
   * For each object in updatables, call each object's own tick() method
   */
  const tick = useCallback(() => {
    const delta = clock.getDelta();
    for (const object of updatables) {
      object.userData.tick?.(delta);
    }
  }, [updatables]);

  /**
   * useEffect runs anytime isLooping changes or when any of the sceneComponents change
   * It sets or nullifies the animation loop based on whether isLooping is true or false
   */
  useEffect(() => {
    if (!(scene && camera && renderer)) return;
    if (isLooping) {
      clock.start();
      renderer.setAnimationLoop(() => {
        tick();
        renderer.render(scene, camera);
      });
    } else {
      clock.stop();
      renderer.setAnimationLoop(null);
    }
  }, [isLooping, tick, scene, camera, renderer]);

  return {
    scene,
    camera,
    isLooping,
    set,
    start,
    stop,
    add,
    dispose
  }
}

export default useLoop;