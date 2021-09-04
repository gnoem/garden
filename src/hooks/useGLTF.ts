import { useEffect, useState } from "react";
import * as THREE from "three";
import { IMeshRegistrationObject, ThreeGroupChild } from "@types";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const useGLTF = (
  filePath: string,
  meshRegistration?: IMeshRegistrationObject
): THREE.Group | null => {
  const [object, setObject] = useState<THREE.Group | null>(null);
  
  useEffect(() => {
    if (object) return; // don't want this to run again if glTF has already been loaded
    const loadObject = (): void => {
      const loader = new GLTFLoader();
      loader.load(filePath, (gltf: GLTF): void => {
        if (meshRegistration) {
          gltf.scene.traverse((child: ThreeGroupChild): void => {
            if (child.type === 'Mesh') {
              meshRegistration[child.name]?.(child as THREE.Mesh);
            }
          });
        }
        setObject(gltf.scene);
      });
    }
    loadObject();
  }, [object]);

  return object;
}

export default useGLTF;