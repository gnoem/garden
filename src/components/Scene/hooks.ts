import { ISceneObjectsMap, IThreeScene } from "@types";
import { useEffect, useState } from "react";

interface ILoadedObjectsMap {
  [objectName: string]: boolean;
}

interface IObjectRollCall {
  rollCallEnabled: boolean;
  allObjectsLoaded: boolean;
}

/* 
this custom hook keeps track of which objects in our scene have loaded.
it does this by adding a setLoaded function to scene.userData, which each object will call when it's done loading.
object components will essentially "announce themselves" and be marked as present on the attendance sheet

its two responsibilities are to:
1. let the parent component (Scene) know when the setLoaded function has been added, which is Scene's signal to go ahead and load those object components. this lets us avoid loading any objects before we can track them.
2. let Scene know when all the objects in the scene have loaded, which is Scene's signal to go ahead and "lift the curtain" (remove the loading screen)
*/

export const useObjectRollCall = (objects: ISceneObjectsMap, { scene }: IThreeScene): IObjectRollCall => {
  
  // create object of type ILoadedObjectsMap to keep track of which objects have loaded
  const createLoadedObjectsMap = (objects) => {
    return Object.keys(objects).reduce((obj, objectName) => {
      obj[objectName] = false;
      return obj;
    }, {});
  }

  const [objectsList, setObjectsList] = useState<ILoadedObjectsMap>(createLoadedObjectsMap(objects));
  const [rollCallEnabled, setRollCallEnabled] = useState<boolean>(false);

  useEffect(() => {
    // tell Scene we're not ready to load any objects yet
    setRollCallEnabled(false);
    // start with a clean loadedObjectsMap (all objects in scene marked as not yet loaded)
    setObjectsList(createLoadedObjectsMap(objects));
  }, [objects]);

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