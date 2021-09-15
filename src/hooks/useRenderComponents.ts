import { useEffect, useState } from "react";
import * as THREE from "three";
import { Loop } from "@lib";
import { IRenderContext } from "@types";

const useRenderComponents = (sceneContainer: HTMLDivElement): IRenderContext => {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [loop, setLoop] = useState<Loop | null>(null);

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

  const renderComponents = {
    renderer,
    loop,
    setLoop
  }

  return renderComponents;
}

export default useRenderComponents;