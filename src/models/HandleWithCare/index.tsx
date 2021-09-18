import * as THREE from "three";
import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";
import { loadTexture } from "@utils";

const HandleWithCare: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/handlewithcare.gltf');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(-0.5, -3, 0);
    object.scale.set(0.6, 0.6, 0.6);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 6 );
    object.applyQuaternion(quaternion);
  }, (object: SceneObject): void => {
    if (object.name === 'Cube020') {
      object.material = new THREE.MeshPhysicalMaterial({
        ...object.material,
        bumpMap: loadTexture('textures/scorpionnormals.png'),
        bumpScale: 0.01,
        metalness: 0.8,
        roughness: 0.1,
        color: new THREE.Color(0xD0C4C7),
        emissive: new THREE.Color(0x453234),
      });
    }
  });

  return null;
}

export default HandleWithCare;
