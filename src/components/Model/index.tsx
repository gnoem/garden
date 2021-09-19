import { useEffect, useState } from "react";
import * as THREE from "three";
import { useGLTF } from "@hooks";
import { SceneObject, ThreeGroupChild } from "@types";

interface IModelComponent {
  name: string;
  filename: string;
  scene: THREE.Scene;
  configObject?: (object: SceneObject) => void;
  configChildMeshes?: (child: THREE.Mesh) => void;
}

const Model: React.FC<IModelComponent> = ({ name, filename, scene, configObject, configChildMeshes }) => {
  const object = useGLTF(`gltf/${filename}`);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (!(object && scene) || added) return;
    object.name = name;
    configObject(object);
    object.traverse((child: ThreeGroupChild): void => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        configChildMeshes?.(child);
      }
    });
    scene.add(object);
    setAdded(true);
  }, [object, added]);

  useEffect(() => {
    if (added) {
      scene.userData.setLoaded?.(name);
    }
  }, [added]);

  return null;
}

export default Model;