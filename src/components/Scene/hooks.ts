import { ISceneObjectsMap, IThreeScene } from "@types";
import { useEffect, useState } from "react";

interface ILoadedObjectsMap {
  [objectName: string]: boolean;
}

interface IObjectRollCall {
  rollCallEnabled: boolean;
  allObjectsLoaded: boolean;
}

/**
 * Keeps track of which objects in our scene have loaded by adding a setLoaded function to `scene.userData`, which each object will use to "announce itself" when it's done loading.
 * 
 * Two responsibilities:
 * 1. Let the parent component (Scene) know when roll call has been enabled, which is Scene's signal to go ahead and load those object components (avoid loading any objects before we can track them)
 * 2. Let Scene know when all the objects in the scene have loaded, which is Scene's signal to go ahead and "lift the curtain" (remove the loading screen).
 * @param objects an object mapping the names of scene objects to their corresponding React components
 * @param sceneComponents the scene components (though only .scene is needed)
 * @returns object roll call interface: has roll call been enabled yet (is it okay to start loading) and have all the objects in the scene loaded yet (is it okay to "lift the curtain")
 */
export const useObjectRollCall = (objects: ISceneObjectsMap, { scene }: IThreeScene): IObjectRollCall => {
  
  /**
   * Create an object to keep track of which scene objects have loaded
   * @param objects SceneObjectsMap
   * @returns LoadedObjectsMap 
   */
  const createLoadedObjectsMap = (objects: ISceneObjectsMap): ILoadedObjectsMap => {
    return Object.keys(objects).reduce((obj, objectName) => {
      obj[objectName] = false;
      return obj;
    }, {});
  }

  const [objectsList, setObjectsList] = useState<ILoadedObjectsMap>(createLoadedObjectsMap(objects));
  const [rollCallEnabled, setRollCallEnabled] = useState<boolean>(false);

  /**
   * when 'objects' changes (e.g. due to theme change), reset rollCallEnabled and objectsList
   */
  useEffect(() => {
    // tell Scene we're not ready to load any objects yet
    setRollCallEnabled(false);
    // start with a clean loadedObjectsMap (all objects in scene marked as not yet loaded)
    setObjectsList(createLoadedObjectsMap(objects));
  }, [objects]);

  /**
   * as soon as the scene loads, add the setLoaded function to scene.userData and then set rollCallEnabled to true
   * does nothing if rollCallEnabled is already true, or if scene.userData.setLoaded already exists
   */
  useEffect(() => {
    if (rollCallEnabled) return;
    if (!scene || scene?.userData.setLoaded) return;
    // add the setLoaded function to scene.userData
    scene.userData.setLoaded = (objectName: string): void => {
      setObjectsList(prevState => ({
        ...prevState,
        [objectName]: true
      }));
    }
    // Scene is now clear to start loading objects
    setRollCallEnabled(true);
  }, [scene, objects, rollCallEnabled]);

  return {
    rollCallEnabled,
    allObjectsLoaded: Object.values(objectsList).every(Boolean)
  }
}