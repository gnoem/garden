import * as THREE from "three";
import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";
import { transformObject } from "@utils";

const Crystal: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/crystal.gltf');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    transformObject.position(object, [0, 0, 2.5]);
    object.userData.tick = (delta) => {
      object.rotation.y += (delta / 2);
    }
    //sceneComponents?.scene?.userData.enableWatchCursor?.(object);
  }, (obj) => {
    Object.assign(obj.material, {
      ior: 2.3,
      roughness: 0,
      metalness: 0,
      color: new THREE.Color('#00FFFF'),
      reflectivity: 0.2,
    });
  });

  return null;
}

export default Crystal;
