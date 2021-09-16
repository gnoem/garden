import { useEffect, useState } from "react";
import * as THREE from "three";
import { IRenderContext } from "@types";
import { useLoop } from "@hooks";

const useRenderComponents = (sceneContainer: HTMLDivElement): IRenderContext => {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  // initialize loop which will be persistent throughout scene changes
  // scene and camera will be added to loop once renderComponents get passed into useSceneComponents
  const loop = useLoop(renderer);

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