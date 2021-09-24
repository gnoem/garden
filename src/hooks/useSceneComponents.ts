import { ILoop, IThreeScene } from "@types";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface ISceneComponentsArgs {
  sceneIsSet: boolean;
  setSceneIsSet: (value: boolean) => void;
  renderer: THREE.WebGLRenderer;
  loop: ILoop;
}

const useSceneComponents = ({ sceneIsSet, setSceneIsSet, renderer, loop }: ISceneComponentsArgs): IThreeScene => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);

  useEffect(() => {
    if (sceneIsSet || !renderer) return;
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    setScene(newScene);
    setCamera(newCamera);
    loop.set(newScene, newCamera);
    loop.start();
    setSceneIsSet(true);
  }, [sceneIsSet, renderer]);

  return {
    scene,
    camera,
    renderer,
    loop
  }
}

export default useSceneComponents;