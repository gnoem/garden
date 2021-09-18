import * as THREE from "three";
import { ILoadTextureInput, ISimpleObject, ILoadedTextureMap, ThreeMaterial, MappedTexturePath } from "@types";

const textureLoader = new THREE.TextureLoader();

export const loadTexture = (path: string): THREE.Texture => {
  const texture = textureLoader.load(path, (texture: THREE.Texture): THREE.Texture => {
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    return texture;
  });
  return texture;
}

export const createMaterialFromTextures = ({ textures, createMaterial }: ILoadTextureInput): ThreeMaterial => {

  let material: ThreeMaterial;

  const texturesArray: MappedTexturePath[] = Object.entries(textures);

  const getLoadedTextures = (): ILoadedTextureMap => {
    return texturesArray.reduce((
      obj: ILoadedTextureMap,
      [map, path]: MappedTexturePath
      ): ILoadedTextureMap => {
      obj[map] = loadTexture(path);
      return obj;
    }, {});
  }

  const loadedTextures: ILoadedTextureMap = getLoadedTextures();
  material = createMaterial(loadedTextures);

  return material;
}

export const defineMaterial = (Material: any, params: ISimpleObject) => (textures: ILoadedTextureMap) => {
  return new Material({
    ...textures,
    ...params
  });
}