import { ILoop, IThreeScene } from "@types";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface ISceneComponentsArgs {
  activeTheme: string;
  renderer: THREE.WebGLRenderer;
  loop: ILoop;
}

/**
 * Initializes the scene and camera and returns our four final sceneComponents
 * @param param0 activeTheme, scene renderer, and loop
 * @returns our four sceneComponents: scene, camera, renderer, and loop
 */
const useSceneComponents = ({ activeTheme, renderer, loop }: ISceneComponentsArgs): IThreeScene => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);

  /**
   * when the activeTheme changes, set isSet to false to trigger the initialization of a new scene and camera
   */
  useEffect(() => {
    if (isSet) setIsSet(false);
  }, [activeTheme]);

  /**
   * if isSet = false and a renderer is defined, initialize a new scene and camera, add them to the loop, and start the loop
   */
  useEffect(() => {
    if (isSet || !renderer) return;
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    setScene(newScene);
    setCamera(newCamera);
    loop.set(newScene, newCamera);
    loop.start();
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