import React, { Dispatch, SetStateAction } from "react";
import * as THREE from "three";
import { IMeshComponentsObject, IMeshRegistrationObject, IMeshesObject, ISimpleObject, MeshRegistrationFunction, IMeshComponentProps, ICoords } from "@types";
export * from "./scene";
export { getInitialState, getAnimationData } from "./interactions";
export * from "./materials";

/**
 * setState callback generator for updating arrays held in React state
 * @param update what function to perform on the array
 * @returns setState callback function
 */
export const newArrayFrom = <T extends unknown>(update: (array: T[]) => void) => (prevArray: T[]): T[] => {
  const arrayToReturn = [...prevArray];
  update(arrayToReturn);
  return arrayToReturn;
}

/**
 * setState callback generator for updating objects held in React state
 * @param update what function to perform on the object
 * @returns setState callback function
 */
export const newObjectFrom = <T extends ISimpleObject>(update: (obj: T) => void) => (prevObj: T): T => {
  const objectToReturn = {...prevObj};
  update(objectToReturn);
  return objectToReturn;
}

/**
 * Gets the last member of an array
 * @param array the array
 * @returns the last member of the array
 */
export const last = <T extends unknown>(array: T[] = []): T => {
  return array[array.length - 1];
}

/**
 * Get the slope of a line from point A to point B
 * @param x1 x coordinate of point A
 * @param y1 x coordinate of point A
 * @param x2 y coordinate of point B
 * @param y2 y coordinate of point B
 * @returns the slope of the line from point A to point B
 */
export const getSlope = (x1: number, y1: number, x2: number, y2: number): number => {
  return (y1 - y2) / (x1 - x2);
}

/**
 * Generate a random number between two values up to X decimal places
 * @param min minimum (exclusive)
 * @param max maximum (inclusive)
 * @param decimalPlaces how many decimal places (default 0, will generate a whole number)
 * @returns random number between min and max
 */
export const randomNumberBetween = (min: number, max: number, decimalPlaces: number = 0): number => {
  const randomDecimal = Math.random() * (max - min) + min;
  const roundingFactor = 10 ** decimalPlaces;
  return Math.round(randomDecimal * roundingFactor) / roundingFactor;
}

/**
 * Round a number to X decimal places
 * @param number the number to round
 * @param places how many decimal places to round it to
 * @returns the number rounded to X decimal places
 */
export const roundToDecimalPlaces = (number: number, places: number): number => {
  const factor = Math.pow(10, places);
  return Math.round(number * factor) / factor;
}

/**
 * Sum two matrices, given as an array of numbers
 * @param firstMatrix the first matrix
 * @param secondMatrix the second matrix
 * @returns the sum of the two matrices
 */
export const sumMatrices = (firstMatrix: number[], secondMatrix: number[]): number[] => {
  return firstMatrix.map((number: number, index: number): number => {
    return number + secondMatrix[index];
  });
}

/**
 * ADVANCED MULTI-MESH GLTF CONFIG
 * if we have a GLTF composed of multiple objects/meshes, we may want to have fine-grained control over individual meshes, including letting each mesh have its own state and side effects and make use of custom hooks like useInteraction. to do so we can create a React component for each mesh, which takes the mesh object as a prop and manages its state, side effects, etc.
*/

/**
 * Create a mesh registration object that can be used to procedurally generate a React component for each mesh in a glTF file, for when we want to have fine-grained control over individual meshes (e.g. letting each mesh have its own state, side effects, use custom hooks, etc.)
 * @param meshNames an array of strings corresponding to the names of the meshes in the glTF file
 * @param setMeshes the parent component's setState function for whatever state it's using to manage its child mesh components
 * @returns A mesh registration object <{ [meshName: string]: registerMesh() }> which will be used by useGLTF: it loops through all the glTF children of type "Mesh" and calls registerMesh() on each one so that the meshes get stored in the parent's state and can then be used to generate a React component for each one using createMeshComponent
 */
export const meshRegistration = (
  meshNames: string[],
  setMeshes: Dispatch<SetStateAction<IMeshesObject>>
): IMeshRegistrationObject => {
  return meshNames.reduce((obj: ISimpleObject, meshName: string): IMeshRegistrationObject => {
    const registerMesh: MeshRegistrationFunction = (object: THREE.Mesh): void => {
      setMeshes(prevState => ({
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

/**
 * Creates a function that will generate a React component for a given mesh
 * @param MeshComponentParams two objects, "meshes" <{ [meshName: string]: THREE.Mesh }> and "components" <{ [meshName: string]: React.FC<IMeshComponentProps> }>
 * @returns a function that returns a JSX.Element for a particular mesh
 */
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

/**
 * Generate a random integer between two numbers
 * @param min minimum number (exclusive)
 * @param max maximum number (inclusive)
 * @returns random integer between min and max
 */
export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * If a drag & drop element is being translated past a given limit, sets its CSS transform property so that it stays in its bounds
 * @param element the drag & drop element
 * @param translate the element's current translate coordinates { x, y }
 * @param max the { x, y } boundaries that the element can't be allowed to cross
 */
export const preventTransformOffscreen = (element: HTMLElement, translate: { x: number, y: number }, max: { x: number, y: number }): void => {
  const checkTopLeft = () => {
    if (translate.x >= 0 && translate.y >= 0) return;
    if (translate.x < 0) translate.x = 0;
    if (translate.y < 0) translate.y = 0;
    element.style.transform = `translate3d(${translate.x}px, ${translate.y}px, 0)`;
  }
  const checkBottomRight = () => {
    if (translate.x <= max.x && translate.y <= max.y) return;
    if (translate.x > max.x) translate.x = max.x;
    if (translate.y > max.y) translate.y = max.y;
    element.style.transform = `translate3d(${translate.x}px, ${translate.y}px, 0)`;
  }
  checkTopLeft();
  checkBottomRight();
}

/**
 * Sanitizes the translation coordinates of a drag & drop element
 * @param current the element's current translate coordinates
 * @param boundary the { x, y } boundaries that the element can't cross
 * @returns corrected { x, y } coordinates
 */
export const getFinalTransform = (current: ICoords, boundary: ICoords): ICoords => {
  let finalX, finalY;
  const checkTopLeft = () => {
    if (current.x >= 0 && current.y >= 0) return;
    if (current.x < 0) finalX = 0;
    if (current.y < 0) finalY = 0;
  }
  const checkBottomRight = () => {
    if (current.x <= boundary.x && current.y <= boundary.y) return;
    if (current.x > boundary.x) finalX = boundary.x;
    if (current.y > boundary.y) finalY = boundary.y;
  }
  checkTopLeft();
  checkBottomRight();
  return {
    x: finalX,
    y: finalY
  }
}

/**
 * Bootleg console.log for troubleshooting on tablet/mobile
 * @param content a string to add to the log
 * @param overwrite clear the console before adding this line
 */
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