import * as THREE from "three";
import { RGBELoader, WatchCursorControls } from "@lib";
import { IThreeScene } from "@types";

/**
 * Creates and enables WatchCursorControls for a given scene
 * @param sceneComponents { scene, camera } of sceneComponents
 * @returns the WatchCursorControls(camera)
 */
export const addWatchCursor = ({ scene, camera }: IThreeScene): WatchCursorControls => {
  const controls = new WatchCursorControls(camera);
  scene.userData.enableWatchCursor = (object: THREE.Group | THREE.Mesh): void => {
    if (!object) return;
    controls.add(object);
    controls.connect();
  }
  return controls;
}

/**
 * Loads an environment texture and adds it to the scene
 * @param filename the filename (NOT including path or extension) of the desired texture, which should exist as both an .hdr and a .jpg inside static/textures/env
 * @param sceneComponents only { scene, renderer } are needed 
 */
export const addEnvironmentTexture = (filename: string, { scene, renderer }: IThreeScene): void => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envPath = `/textures/env/`;

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(`${envPath}${filename}.hdr`, (texture: THREE.Texture): void => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.compileEquirectangularShader();
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  });

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(`${envPath}${filename}.jpg`, (texture: THREE.Texture) => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    rt.texture.encoding = THREE.sRGBEncoding;
    scene.background = rt.texture;
  });
}