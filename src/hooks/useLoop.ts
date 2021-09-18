import * as THREE from "three";
import { mutateStateArray } from "@utils";
import { useCallback, useEffect, useState } from "react";
import { ILoop, SceneObject } from "@types";

const clock = new THREE.Clock();

const useLoop = (renderer: THREE.WebGLRenderer): ILoop => {
  const [{ scene, camera }, setLoop] = useState<{ scene: THREE.Scene; camera: THREE.Camera }>({
    scene: null,
    camera: null
  });
  const [updatables, setUpdatables] = useState<SceneObject[]>([]);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  const set = (scene: THREE.Scene, camera: THREE.Camera) => {
    setLoop({ scene, camera });
  }

  const start = () => setIsLooping(true);
  const stop = () => setIsLooping(false);
  const add = (obj) => setUpdatables(mutateStateArray(array => array.push(obj)));

  const dispose = () => {
    for (const object of updatables) {
      object.userData.disconnect?.(); // remove any event listeners, etc. - this is primarly for updatables like CameraControls that need cleanup beyond just discontinuing their tick() method
    }
    setUpdatables([]);
  }

  const tick = useCallback(() => {
    const delta = clock.getDelta();
    for (const object of updatables) {
      object.userData.tick?.(delta);
    }
  }, [updatables]);

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