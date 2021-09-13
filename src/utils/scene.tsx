import * as THREE from "three";
import { RGBELoader, RoughnessMipmapper, WatchCursorControls } from "@lib";
import { IThreeScene } from "@types";

export const addWatchCursor = (scene: THREE.Scene, camera: THREE.Camera): WatchCursorControls => {
  const controls = new WatchCursorControls(camera);
  scene.userData.enableWatchCursor = (object: THREE.Group | THREE.Mesh): void => {
    if (!object) return;
    controls.add(object);
    controls.connect();
  }
  return controls;
}

export const addEnvironmentTexture = (filename: string, { scene, renderer }: IThreeScene): void => {
  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    // @ts-ignore
    .setPath('textures/')
    .load(filename, (texture: THREE.Texture): void => {

      const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      // use of RoughnessMipmapper is optional
      const roughnessMipmapper = new RoughnessMipmapper(renderer);
      roughnessMipmapper.dispose();
    });
}