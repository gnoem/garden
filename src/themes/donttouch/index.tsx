import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture, addWatchCursor } from "@utils";

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('stormy', sceneComponents);
  addWatchCursor(scene, camera);
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 1 );
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
}

/* const load = () => {
  return (
    <Backdrop>
      <Scene objects={['donttouch']} load={loadScene} />
    </Backdrop>
  )
} */

export default {
  objects: ['donttouch'],
  load,
  className: 'oracle'
}