import * as THREE from "three";
import { IThreeScene } from "@types";
import { addEnvironmentTexture, addWatchCursor } from "@utils";

const load = (sceneComponents: IThreeScene) => {
  const { scene, camera } = sceneComponents;
  camera.position.set(0, 0, 10);
  addEnvironmentTexture('hellscape', sceneComponents);
  addWatchCursor(scene, camera);
  const primaryLight = new THREE.DirectionalLight( 0x11ff00, 1 );
  primaryLight.position.set(50, 0, 0);
  scene.add(primaryLight);
}

const objects = ['crystal'];

/* const load = () => {
  return (
    <Backdrop>
      <Scene objects={['crystal']} load={loadScene} />
    </Backdrop>
  )
} */

export default {
  objects,
  load,
  className: 'oracle'
}