import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";

const Oracle: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/oracle.glb');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(0, 1.5, 2);
    sceneComponents?.scene?.userData.enableWatchCursor?.(object);
  });

  return null;
}

export default Oracle;
