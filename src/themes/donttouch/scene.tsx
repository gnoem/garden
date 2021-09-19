import { useAddObject, useGLTF } from "@hooks";
import { IObjectComponentProps, SceneObject } from "@types";

export const DontTouch: React.FC<IObjectComponentProps> = ({ name, sceneComponents }) => {
  const object = useGLTF('gltf/donttouch.gltf');

  useAddObject(object, sceneComponents, (object: SceneObject): void => {
    object.name = name;
    object.position.set(0, -2.75, 5);
    object.userData.tick = (delta) => {
      object.rotation.y -= (delta / 2);
    }
    sceneComponents.loop?.add(object);
  });

  return null;
}