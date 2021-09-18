import * as THREE from "three";
import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";

const HandleWithCare: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/handlewithcare.gltf');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(-0.5, -3, 0);
    object.scale.set(0.6, 0.6, 0.6);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 6 );
    object.applyQuaternion(quaternion);
  });

  return null;
}

export default HandleWithCare;
