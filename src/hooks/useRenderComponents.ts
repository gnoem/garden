import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoop } from "@hooks";
import { ILoop } from "@types";

interface IRenderContext {
  renderer?: THREE.WebGLRenderer | null;
  loop?: ILoop | null;
}

interface IRenderComponentsProps {
  sceneContainer: HTMLDivElement;
  activeTheme: string;
}

const useRenderComponents = ({ activeTheme, sceneContainer }: IRenderComponentsProps): IRenderContext => {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  // initialize loop which will be persistent throughout scene changes
  // scene and camera will be added to loop once renderComponents get passed into useSceneComponents
  const loop = useLoop(renderer);

  useEffect(() => {
    loop?.dispose();
  }, [activeTheme]);

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