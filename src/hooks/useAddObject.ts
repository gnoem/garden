import { useEffect, useState } from "react";
import * as THREE from "three";
import { SceneObject, IThreeScene, ThreeGroupChild } from "@types";

const useAddObject = (
  object: SceneObject | null,
  { scene, loop }: IThreeScene,
  configObject: (object: SceneObject) => void,
  configChildMeshes?: (object: THREE.Mesh) => void
): boolean => {
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (!(object && scene && loop) || added) return;
    configObject(object);
    object.traverse((child: ThreeGroupChild): void => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        configChildMeshes?.(child);
      }
    });
    scene.add(object);
    loop.add(object);
    scene.userData.setLoaded(object.name);
    setAdded(true);
  }, [object, added]);

  return added;
}

export default useAddObject;