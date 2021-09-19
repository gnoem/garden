import * as THREE from "three";
import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";

export const Crystal: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/crystal.gltf');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(0, 0, 2.5);
    object.userData.tick = (delta) => {
      object.rotation.y += (delta / 2);
    }
    sceneComponents.loop?.add(object);
  }, (obj) => {
    Object.assign(obj.material, {
      ior: 2.3,
      roughness: 0,
      metalness: 0,
      color: new THREE.Color('#00FFFF'),
      reflectivity: 0.2,
      transmission: 1,
      clearcoat: 1,
      clearcoatRoughness: 1,
    });
  });

  return null;
}