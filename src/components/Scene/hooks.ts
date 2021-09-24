import { useEffect, useState } from "react";
import { usePrevious } from "@hooks";
import { ISceneContext, ISceneObjectsMap } from "@types";

/*
allows objects to "announce themselves" once they've loaded, by adding a setLoaded function to scene.userData that will be called by each object once it's finished loading
this way, the scene can know when to "lift the curtain" (take off the loading screen)
*/

interface ILoadedObjectsMap {
  [objectName: string]: boolean;
}

export const useVerifyLoaded = (
  objects: ISceneObjectsMap,
  sceneContext: ISceneContext
): boolean => {
  
  const { sceneComponents, loading, setLoading } = sceneContext;
  const { scene } = sceneComponents;

  // create object of type ILoadedObjectsMap to keep track of which objects have loaded
  const createObjectsList = (objects: ISceneObjectsMap): ILoadedObjectsMap => Object.keys(objects).reduce((obj, name) => {
    obj[name] = false;
    return obj;
  }, {});

  const [objectsList, setObjectsList] = useState<ILoadedObjectsMap>(createObjectsList(objects));

  const prevObjectsList = usePrevious(objectsList);

  useEffect(() => {
    if (!loading) {
      // should have already been set to loading when activeTheme changed, but just in case something went wrong:
      setLoading(true);
      // might turn out to be unnecessary if we end up making "isSceneReady" a function of a bunch of different other states, e.g. themeReady, objectsReady etc
    }
    setObjectsList(createObjectsList(objects));
    console.log(`theme changed`);
  }, [objects]);

  useEffect(() => {
    console.log(scene);
  }, [scene]);

  useEffect(() => {
    console.log(scene?.userData.setLoaded);
  }, [scene?.userData.setLoaded]);

  useEffect(() => {
    if (!loading) return console.log(`scene is loaded already, abort`);
    if (!scene?.userData.setLoaded) return console.log(`userData hasn't been updated with setAdded`);
    console.log(`loading...`)
    const didSomeObjectLoad = () => {
      if (!prevObjectsList) {
        return false;
      }
      // is there some entry in objects, such that in prevObjectsList it was false and now is true?
      const someObjectDidLoad = Object.entries(objectsList).some(([objectName, loaded]) => (loaded === true) && (prevObjectsList[objectName] === false));
      return someObjectDidLoad;
    }
    const someObjectDidLoad = didSomeObjectLoad();
    console.log(`objectsList: [${prevObjectsList ? Object.entries(prevObjectsList).join(': ') : 'null'}] --> [${Object.entries(objectsList).join(': ')}]`);
    if (someObjectDidLoad) {
      console.log(`some object did load`)
    } else {
      return console.log(`no object loaded`);
    }
    /* 
    1. new objects in scene
    2. objects loaded
    3. is ready!
    */
    const isReady = Object.values(objectsList).every(Boolean);
    const delay = 500; // wiggle room
    if (isReady) {
      console.log(`isReady! ${Object.entries(objectsList).join(': ')}`)
      setTimeout(() => {
        console.log(`all objects loaded: ${Object.entries(objectsList).join(': ')}`);
        setLoading(false);
      }, delay);
    }
  }, [objectsList, loading, scene?.userData.setLoaded]);

  useEffect(() => {
    if (!scene) return;
    const setLoaded = (objectName: string): void => {
      console.log(`marking ${objectName} as loaded inside objectsList`);
      setObjectsList(prevList => ({
        ...prevList,
        [objectName]: true
      }));
    }
    // make setLoaded function available to scene children so they can "announce" when they're loaded
    scene.userData.setLoaded = setLoaded; // this is getting added to the OLD scene!!!!!
    console.log(`scene.userData.setLoaded = setLoaded`);
  }, [scene]);

  return scene?.userData.setLoaded;
}