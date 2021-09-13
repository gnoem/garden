import { useEffect, useState } from "react";
import * as THREE from "three";
import { Loop } from "@lib";
import { IRenderContext, IThreeScene } from "@types";
import { addWatchCursor } from "@utils";

const useScene = (sceneRef: HTMLElement | null, renderContext: IRenderContext, loadTheme: (sceneComponents: IThreeScene) => void): IThreeScene => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const [scene, setScene] = useState<IThreeScene>({
    scene: null,
    camera: null,
    renderer: null,
    loop: null
  });

  useEffect(() => {
    if (!sceneRef || !renderContext || isSet) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer;
    if (renderContext.renderer) {
      renderer = renderContext.renderer;
    } else {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    const loop = new Loop(scene, camera, renderer);
    loadTheme?.({ scene, camera, renderer, loop });
    addWatchCursor(scene, camera);
    setScene({ scene, camera, renderer, loop });
    renderContext.setLoop(loop);
    renderContext.setRenderer(renderer);
    loop.start();
    if (!renderContext.renderer) {
      sceneRef.appendChild(renderer.domElement);
    }
    setIsSet(true);
  }, [isSet, renderContext, sceneRef]);

  return scene;
}

export default useScene;