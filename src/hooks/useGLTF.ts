import { useEffect, useState } from "react";
import * as THREE from "three";
import { IMeshRegistrationObject, ThreeGroupChild } from "@types";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Loads an object from glTF file
 * @param filePath full path to glTF file
 * @param meshRegistration (optional) a mesh registration object generated using meshRegistration() util. only if you want fine-grained control over individual meshes
 * @returns the object loaded from glTF
 */
const useGLTF = (
  filePath: string,
  meshRegistration?: IMeshRegistrationObject
): THREE.Group | null => {
  const [object, setObject] = useState<THREE.Group | null>(null);
  const [_, setMounted] = useState<boolean>(false);

  /**
   * useEffect runs on first render
   * for whatever reason this makes the 'can't update an unmounted component'/memory leak error disappear, i have no idea why
   */
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  /**
   * useEffect runs immediately and does not run again after object has been loaded
   * loads glTF via GLTFLoader
   * if meshRegistration argument is supplied, loops through object children and registers individual meshes in the parent component's state, with the aim of binding each one to its own React component later on
   */
  useEffect(() => {
    if (object) return; // don't want this to run again if glTF has already been loaded
    const loader = new GLTFLoader();
    loader.load(filePath, (gltf: GLTF): void => {
      if (meshRegistration) {
        gltf.scene.traverse((child: ThreeGroupChild): void => {
          if (child.type === 'Mesh') {
            meshRegistration[child.name]?.(child as THREE.Mesh);
          }
        });
      }
      setObject(gltf.scene); // memory leak error at this line
    });
  }, [object]);

  return object;
}

export default useGLTF;