import { ISceneContext } from "@types";
import { mutateStateArray } from "@utils";
import { useEffect, useState } from "react";
import { ILoadedObject } from ".";

export const useVerifyLoaded = (objectNames: string[], { activeTheme, loading, setLoading }: ISceneContext): {
  setLoaded: (objectName: string) => void;
} => {
  
  const loadedObjects = objectNames.map((name: string): ILoadedObject => ({
    name,
    loaded: false
  }));

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
    if (!loading) setLoading(true);
    setObjectsList(loadedObjects);
  }, [activeTheme]);

  useEffect(() => {
    if (!objectsList || !loading) return;
    const isReady = objectsList.every(obj => obj.loaded);
    const delay = 500; // wiggle room
    if (isReady) {
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  }, [objectsList]);

  return {
    setLoaded
  }
}