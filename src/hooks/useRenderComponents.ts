import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoop } from "@hooks";
import { ILoop } from "@types";

interface IRenderContext {
  renderer: THREE.WebGLRenderer | null;
  loop: ILoop;
}

interface IRenderComponentsProps {
  sceneContainer: HTMLDivElement | null;
  activeTheme: string;
}

/**
 * Creates and returns the render components, renderer and loop, which will be persistent throughout theme changes (as opposed to the scene components, scene and camera, which are reinitialized each time)
 * @param param0 activeTheme: the current active theme, sceneContainer: the HTML element containing the scene
 * @returns the scene renderer and loop
 */
const useRenderComponents = ({ activeTheme, sceneContainer }: IRenderComponentsProps): IRenderContext => {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const loop = useLoop(renderer); // scene and camera will be added once renderComponents get passed into useSceneComponents

  /**
   * useEffect runs when activeTheme changes
   * calls the loop's dispose() method, which clears all scene objects in the loop and performs any necessary cleanup
   */
  useEffect(() => {
    loop?.dispose();
  }, [activeTheme]);

  /**
   * useEffect runs as soon as sceneContainer is defined
   * Initializes our renderer, then appends the canvas (renderer.domElement) to the sceneContainer
   */
  useEffect(() => {
    if (renderer || !sceneContainer) return;
    const newRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    newRenderer.setPixelRatio(window.devicePixelRatio);
    newRenderer.shadowMap.enabled = true;
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.outputEncoding = THREE.sRGBEncoding;
    setRenderer(newRenderer);
    sceneContainer.appendChild(newRenderer.domElement);
  }, [sceneContainer]);

  return {
    renderer,
    loop
  }
}

export default useRenderComponents;