import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

/**
 * Load a THREE texture
 * @param path the path of the desired texture
 * @returns THREE.Texture
 */
export const loadTexture = (path: string): THREE.Texture => {
  const texture = textureLoader.load(path, (texture: THREE.Texture): THREE.Texture => {
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    return texture;
  });
  return texture;
}