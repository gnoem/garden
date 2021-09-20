import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export const loadTexture = (path: string): THREE.Texture => {
  const texture = textureLoader.load(path, (texture: THREE.Texture): THREE.Texture => {
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    return texture;
  });
  return texture;
}