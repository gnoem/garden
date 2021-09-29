// this is an incoherent mess
// fixme or get rid of me

import * as THREE from "three";
import { IAnimationData, IInteractionDef, IInteractionMap, IKeyframe, IKeyframeMap } from "@types";
import { last, sumMatrices } from "@utils";

interface IFullKeyframe {
  rotation: THREE.Quaternion;
  position: number[];
  scale: number[];
}

type IFullKeyframeTrack = [
  THREE.QuaternionKeyframeTrack,
  THREE.VectorKeyframeTrack,
  THREE.VectorKeyframeTrack
]

/**
 * Get the initial state of a given interaction
 * @param blueprint the blueprint for a given interaction
 * @returns the name of the starting state
 */
const getInitialState = (blueprint: IInteractionMap): string => Object.keys(blueprint)[0];

/**
 * Get the keyframe track for a given "state A -> state B" interaction
 * @param states the array of (string) state names for this interaction
 * @param times the array of (number) times (in seconds) for this interaction
 * @param animationKeyframes the animation keyframe map <{ [stateName: string]: { rotation, position, scale } }>
 * @returns the full keyframe track for this interaction, which will be an array of the form [THREE.QuaternionKeyframeTrack, THREE.VectorKeyframeTrack, THREE.VectorKeyframeTrack]
 */
const getKeyframeTracks = (
  states: string[],
  times: number[],
  animationKeyframes: () => IKeyframeMap
): IFullKeyframeTrack => {
  // todo- if states.length and times.length differ, still do it with necessary adjustments but console.warn
  const getQuaternion = (array: number[]): THREE.Quaternion => {
    const euler = new THREE.Euler(...array);
    return new THREE.Quaternion().setFromEuler(euler);
  }
  const getKeyframe = (name: string): IFullKeyframe => {
    return {
      rotation: getQuaternion(animationKeyframes()[name].rotation),
      position: animationKeyframes()[name].position,
      scale: animationKeyframes()[name].scale,
    }
  }
  const generateTracks = (keyframes: IFullKeyframe[]): IFullKeyframeTrack => {
    const rotationKF = new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      times,
      keyframes.map((keyframe: IFullKeyframe): number[] => {
        return [keyframe.rotation.x, keyframe.rotation.y, keyframe.rotation.z, keyframe.rotation.w]
      }).flat()
    )
    const positionKF = new THREE.VectorKeyframeTrack(
      '.position',
      times,
      keyframes.map((keyframe: IFullKeyframe): number[] => {
        return [...keyframe.position]
      }).flat()
    )
    const scaleKF = new THREE.VectorKeyframeTrack(
      '.scale',
      times,
      keyframes.map((keyframe: IFullKeyframe): number[] => {
        return [...keyframe.scale]
      }).flat()
    )
    return [
      rotationKF,
      positionKF,
      scaleKF
    ]
  }
  const keyframes: IFullKeyframe[] = states.map((state: string): IFullKeyframe => getKeyframe(state));
  return generateTracks(keyframes);
}

interface IKeyframeRow {
  dimension: string;
  value: number[];
}

/**
 * Creates a keyframe based on a starting rotation/position/scale and a delta rotation/position/scale, all in the form <{ rotation: [x, y, z], position: [x, y, z], scale: [x, y, z] }>
 * @param originalKeyframe the starting keyframe
 * @param delta the desired change
 * @returns a new keyframe which represents the original keyframe combined with the delta keyframe
 */
export const createKeyframeFromDelta = (originalKeyframe: IKeyframe, delta: IKeyframe): IKeyframe => {
  // for each [rotation, position, scale] in originalKeyframe, add the corresponding array element of delta
  const originalKeyframeEntries: [string, number[]][] = Object.entries(originalKeyframe);
  const newKeyframeRows: IKeyframeRow[] = originalKeyframeEntries.map(([dimension, values]: [string, number[]]): IKeyframeRow => {
    const newValue = sumMatrices(values, delta[dimension] ?? [0, 0, 0]);
    return {
      dimension,
      value: newValue
    }
  });
  return newKeyframeRows.reduce((obj: IKeyframe, { dimension, value }: IKeyframeRow): IKeyframe => {
    obj[dimension] = value;
    return obj;
  }, {});
}

/**
 * Creates a function that creates & plays an animation when called
 * @param animationKeyframes a function that returns the keyframe map <{ [stateName: string]: { rotation, position, scale } }> for this animation
 * @returns a function that creates and plays a THREE.AnimationClip based on the given parameters
 */
const animate = (animationKeyframes: () => IKeyframeMap) => (
  mixer: THREE.AnimationMixer,
  states: string[],
  times: number[],
  loop: boolean = false
): void => {
  const play = (clip: THREE.AnimationClip): void => {
    const action = mixer.clipAction(clip);
    if (!loop) {
      action.setLoop(THREE.LoopOnce, 0);
      action.clampWhenFinished = true;
    }
    action.play();
  }
  const clip = new THREE.AnimationClip(states.join('-to-'), -1, getKeyframeTracks(states, times, animationKeyframes));
  play(clip);
}

/**
 * Get the animation data for a particular keyframe map
 * @param animationKeyframes a function that returns the keyframe map <{ [stateName: string]: { rotation, position, scale } }> for this animation
 * @returns the animation data for this animation: { animationKeyframes, playAnimation }
 */
const getAnimationData = (animationKeyframes: () => IKeyframeMap): IAnimationData => {
  return {
    animationKeyframes,
    playAnimation: animate(animationKeyframes)
  }
}

/**
 * Get the duration of an animation in milliseconds
 * @param interactionDef The interaction definition (only .times is needed)
 * @returns the duration of this animation in milliseconds
 */
const getAnimationDuration = ({ times }: IInteractionDef): number => last(times) * 1000;

export {
  getInitialState,
  getAnimationData,
  getAnimationDuration
}