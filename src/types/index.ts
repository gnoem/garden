import { Loop } from "@lib";
import * as THREE from "three";

export interface ISimpleObject {
  [key: string]: any;
}

export interface IStringObject {
  [key: string]: string;
}

// THREE scenes, objects

export interface IThreeScene {
  object?: SceneObject | null;
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  loop?: Loop | null;
}

export type SceneObject = THREE.Group | THREE.Mesh;

export type SceneElement = SceneObject | THREE.DirectionalLight;

export type ThreeGroupChild = THREE.Object3D | THREE.Mesh;

export interface IObjectComponentProps {
  key: string;
  name: string;
  sceneComponents: IThreeScene;
  setLoaded?: (value: boolean) => void;
}

// object interactions, animations

export interface IAnimationData {
  animationKeyframes: () => IKeyframeMap;
  playAnimation: (mixer: THREE.AnimationMixer, states: string[], times: number[]) => void
}

export interface IInteractionDef {
  steps: string[];
  times: number[];
  blueprint?: boolean; // if true, follow interaction blueprint
  passive?: boolean; // if false or undefined, blocks further attempts to interact until this one is complete
}

export type IInteractionOptions = Partial<IInteractionDef>;

export interface IInteractionMap {
  [start: string]: IInteractionDef
}

export interface IInteractionEvents {
  [state: string]: (prevState: IInteractionDef) => void;
}

export type IInteractionEventMap = (
  object: SceneObject,
  scene: THREE.Scene,
  next: (customState?: IInteractionOptions) => void
) => IInteractionEvents;

export type IKeyframe = {
  //[K in 'position' | 'rotation' | 'scale']: number[]
  [key: string]: number[]
}

export interface IKeyframeMap {
  [name: string]: IKeyframe
}

export interface IInteraction {
  blueprint: IInteractionMap;
  animations: IAnimationData;
  events?: IInteractionEventMap | null;
}

// materials & textures

export type ThreeMaterial = THREE.MeshBasicMaterial | THREE.MeshPhysicalMaterial | THREE.MeshPhongMaterial;

export type MappedTexturePath = [string, string];

export interface ITexturePathMap {
  [mapName: string]: string;
}

export interface ILoadedTextureMap {
  [mapName: string]: THREE.Texture;
}

export interface ILoadTextureInput {
  textures: ITexturePathMap;
  createMaterial: (textures: ILoadedTextureMap) => any;
}

// advanced mesh config for loading multi-mesh GLTFs

export interface IMeshConfig {
  name?: string;
  material?: ThreeMaterial | 'loading',
  userData?: {
    hoverCursor?: string;
    events?: {
      click?: () => void;
    }
  }
}

export interface IMeshComponentProps {
  name: string;
  mesh: THREE.Mesh;
}

export interface IMeshesObject {
  [name: string]: THREE.Mesh;
}

export interface IMeshComponentsObject {
  [name: string]: React.FC<IMeshComponentProps>
}

export type IMeshRegistrationFunction = (object: THREE.Mesh) => void;

export interface IMeshRegistrationObject {
  [meshName: string]: IMeshRegistrationFunction
}