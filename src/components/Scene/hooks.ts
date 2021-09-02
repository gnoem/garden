import { IThreeScene } from "@types";
import { mutateStateArray } from "@utils";
import { useEffect, useState } from "react";
import { ILoadedObject } from ".";

export const useVerifyLoaded = (objectNames: string[], sceneComponents: IThreeScene): {
  loading: boolean;
  setLoaded: (objectName: string) => void;
} => {
  const loadedObjects = objectNames.map((name: string): ILoadedObject => ({
    name,
    loaded: false
  }));

  const [loading, setLoading] = useState<boolean>(true);
  const [objectsList, setObjectsList] = useState<ILoadedObject[]>(loadedObjects);

  const setLoaded = (objectName: string): void => {
    setObjectsList(mutateStateArray((array: ILoadedObject[]): ILoadedObject[] => {
      const index = array.findIndex(obj => obj.name === objectName);
      return array.splice(index, 1, {
        name: objectName,
        loaded: true
      });
    }));
  }

  useEffect(() => {
    if (!sceneComponents || !objectsList) return;
    const isReady = objectsList.every(obj => obj.loaded);
    const delay = 0// 3000;
    if (isReady) {
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  }, [sceneComponents, objectsList]);

  return {
    loading,
    setLoaded
  }
}