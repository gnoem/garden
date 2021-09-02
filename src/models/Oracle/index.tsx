import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";
import { transformObject } from "@utils";

const Oracle: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/oracle.glb');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    transformObject.position(object, [0, 10, 0]);
    sceneComponents?.scene?.userData.enableWatchCursor?.(object);
  });

  return null;
}

export default Oracle;
