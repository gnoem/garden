import { useEffect, useState } from "react";
import * as THREE from "three";
import { Loop } from "@lib";

const useSceneComponents = ({ isSet, setIsSet, renderer, loop, setLoop }) => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);

  useEffect(() => {
    if (isSet || !renderer) return;
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    setScene(newScene);
    setCamera(newCamera);
    if (!loop) {
      const newLoop = new Loop(newScene, newCamera, renderer);
      setLoop(newLoop);
      newLoop.start();
    } else {
      loop.scene = newScene;
      loop.camera = newCamera;
    }
    setIsSet(true);
  }, [isSet, renderer]);

  return {
    scene,
    camera,
    renderer,
    loop
  }
}

export default useSceneComponents;