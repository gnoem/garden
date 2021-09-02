import React, { Dispatch, SetStateAction } from "react";
import * as THREE from "three";
import { IMeshComponentsObject, IMeshRegistrationObject, IMeshesObject, ISimpleObject, IMeshRegistrationFunction, IMeshComponentProps, SceneElement } from "@types";
export { getInitialState, getAnimationData } from "./interactions";
export { createMaterialFromTextures, defineMaterial } from "./materials";

export const mutateStateArray = (update: ((array: any[]) => void) | null) => (prevArray: React.SetStateAction<any>): any[] => {
  const arrayToReturn = [...prevArray];
  update?.(arrayToReturn);
  return arrayToReturn;
}

export const last = (array: any[] = []): any => {
  return array[array.length - 1];
}

export const getSlope = (x1: number, y1: number, x2: number, y2: number): number => {
  return (y1 - y2) / (x1 - x2);
}

export const randomNumberBetween = (min: number, max: number, decimalPlaces: number = 0): number => {
  const randomDecimal = Math.random() * (max - min) + min;
  const roundingFactor = 10 ** decimalPlaces;
  return Math.round(randomDecimal * roundingFactor) / roundingFactor;
}

export const roundToDecimalPlaces = (number: number, places: number): number => {
  const factor = Math.pow(10, places);
  return Math.round(number * factor) / factor;
}

export const sumMatrices = (firstMatrix: number[], secondMatrix: number[]): number[] => {
  return firstMatrix.map((number: number, index: number): number => {
    return number + secondMatrix[index];
  });
}

export const transformObject: {
  [property: string]: (model: SceneElement, [x, y, z]: number[]) => void
} = {
  position: (model: SceneElement, [x, y, z]: number[]): void => {
    Object.assign(model.position, { x, y, z });
  },
  rotation: (model: SceneElement, [x, y, z]: number[]): void => {
    const euler = new THREE.Euler(...[x, y, z]);
    model.setRotationFromEuler(euler);
  },
  scale: (model: SceneElement, [x, y, z]: number[]): void => {
    Object.assign(model.scale, { x, y, z });
  }
}

/* ADVANCED MULTI-MESH GLTF CONFIG
if we have a GLTF composed of multiple objects/meshes, we may want to have fine-grained control over individual meshes, including letting each mesh have its own state and side effects and make use of custom hooks like useInteraction. to do so we can create a React component for each mesh, which takes the mesh object as a prop and manages its state, side effects, etc. working example: a multi-mesh GLTF BowlOfFruit with Bowl, Apple, Bananas, Peach as meshes

meshRegistration takes as its two arguments (1) an array of strings corresponding to the names of the meshes in the GLTF file (['bowl', 'apple', 'bananas', 'peach']), and (2) a setMeshes function to 'register' each mesh in the parent (BowlOfFruit) component
useGLTF will use the return object to loop through the GLTF children whose type === 'Mesh' and call registerMesh on each one so that the meshes get stored in the parent and can then be used to generate a React component for each mesh using createMeshComponent
*/

export const meshRegistration = (
  meshNames: string[],
  setMeshes: Dispatch<SetStateAction<IMeshesObject>>
): IMeshRegistrationObject => {
  return meshNames.reduce((obj: ISimpleObject, meshName: string): IMeshRegistrationObject => {
    const registerMesh: IMeshRegistrationFunction = (object: THREE.Mesh): void => {
      setMeshes((prevState: IMeshesObject): IMeshesObject => ({
        ...prevState,
        [meshName]: object
      }));
    }
    obj[meshName] = registerMesh;
    return obj;
  }, {});
}

interface ICreateMeshComponentParams {
  meshes: IMeshesObject;
  components: IMeshComponentsObject;
}

export const createMeshComponent = (
  { meshes, components }: ICreateMeshComponentParams
): ((meshName: string) => JSX.Element) => {
  return (meshName: string): JSX.Element => {
    const Component: React.FC<IMeshComponentProps> = components[meshName];
    const mesh: THREE.Mesh = meshes[meshName];
    return <Component {...{
      key: meshName,
      name: meshName,
      mesh
    }} />;
  }
}

export const mutateArray = (update) => (prevArray) => {
  const arrayToReturn = [...prevArray];
  update(arrayToReturn);
  return arrayToReturn;
}

export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const preventTransformOffscreen = (element, transform, max) => {
  const checkTopLeft = () => {
    if (transform.x >= 0 && transform.y >= 0) return;
    if (transform.x < 0) transform.x = 0;
    if (transform.y < 0) transform.y = 0;
    element.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }
  const checkBottomRight = () => {
    if (transform.x <= max.x && transform.y <= max.y) return;
    if (transform.x > max.x) transform.x = max.x;
    if (transform.y > max.y) transform.y = max.y;
    element.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }
  checkTopLeft();
  checkBottomRight();
}

// bootleg console for troubleshooting on tablet/mobile
export const fakeConsole = (content: string, overwrite: boolean = false): void => {
  const createDiv = (): HTMLElement => {
    const div = document.createElement('div');
    div.id = 'console';
    div.ontouchstart = () => div.innerHTML = '';
    div.onmousedown = () => div.innerHTML = '';
    return div;
  }
  const div = document.querySelector('#console') ?? createDiv();
  if (overwrite) {
    div.innerHTML = content;
  } else {
    div.innerHTML += `<br>${content}`;
  }
  document.body.appendChild(div);
}