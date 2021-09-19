import * as THREE from "three";
import { Water } from "@lib";
import { ILoop, IObjectComponentProps, SceneObject } from "@types";
import { useAddObject, useGLTF } from "@hooks";

export const Oracle: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/oracle.glb');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(0, 1.5, 2);
    sceneComponents.scene?.userData.enableWatchCursor?.(object);
    sceneComponents.loop?.add(object);
  });

  return null;
}

export const addWater = (scene: THREE.Scene, loop: ILoop): Water => {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    normalSampler: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture: THREE.Texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: new THREE.Color(0xffffff),
    waterColor: new THREE.Color(0x001e0f),
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  });

  water.position.y = -5;
  water.rotation.x = -Math.PI / 2;
  const waterMaterial = water.material;
  water.userData.tick = () => {
    waterMaterial.uniforms['time'].value += 1.0 / 60.0;
  }

  loop.add(water);
  scene.add(water);

  return water;
}