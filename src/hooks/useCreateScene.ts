import { IThreeScene } from "@types";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { Loop } from "@lib";

const useSceneComponents = ({ renderer, loop, setLoop }, { isSet, setIsSet }): IThreeScene => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);

  const sceneComponents = {
    scene,
    camera,
    renderer,
    loop
  }

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

  return sceneComponents;
}

export default useSceneComponents;