import * as THREE from "three";
import { IInteraction, IInteractionDef, IKeyframeMap, IInteractionEvents, IInteractionOptions, SceneObject } from "@types";
import { getAnimationData } from "@utils";
import { createKeyframeFromDelta, getAnimationDuration } from "@utils/interactions";

const blueprint: {
  [start: string]: IInteractionDef
} = {
  'underwater': {
    steps: ['abovewater'],
    times: [3]
  },
  'abovewater': {
    steps: ['welcome'],
    times: [3],
    passive: true
  },
  'welcome': {
    steps: ['welcomed'],
    times: [3],
  },
  'welcomed': {
    steps: ['help'],
    times: [2]
  },
  'help': {
    steps: ['welcomed'],
    times: [2]
  }
}

const events = (
  object: SceneObject,
  scene: THREE.Scene,
  next: (customState?: IInteractionOptions) => void
): IInteractionEvents => {
  const abovewater = (prevState: IInteractionDef): void => {
    // after animation duration, unlock useWatchCursor for oracle!
    setTimeout(() => {
      scene.userData.enableWatchCursor?.(object.name);
    }, getAnimationDuration(prevState));
  }
  const welcome = (): void => {
    const name = prompt(`
      hi, welcome to the altar at GNAGUA W16V\n
      its nice to have a visitors!\n
      please enter your name
    `);
    if (!name || ['no', 'nope', 'no thanks', 'no thank you', 'fuck you', 'fuck u'].includes(name.toLowerCase().trim())) {
      alert(`
        thats ok, i understand not wanting to share. stranger danger and all.
      `)
    } else {
      alert(`
        hi ${name} pleasure to make your acquaintance :)
      `)
    }
    alert(`
      im the oracle here, i can help you if you have questions or are not sure how this works.\n
      after you click out of this box, use W/A/S/D to move, and use the arrow keys or click & drag the screen to look around. pinch/drag with 2 fingers if you're using a touch screen. hope you enjoy!
    `);
    next();
  }
  const welcomed = (prevState: IInteractionDef): void => {
    scene.userData.unlock('lookaround');
    setTimeout(() => {
      scene.remove(object);
    }, getAnimationDuration(prevState));
  }
  return {
    abovewater,
    welcome,
    welcomed
  }
}

const animationKeyframes = (): IKeyframeMap => {
  const abovewater = {
    rotation: [0, 0, 0],
    position: [0, 10, -20],
    scale: [3, 3, 3]
  }
  const underwater = createKeyframeFromDelta(abovewater, {
    rotation: [0, Math.PI, 0],
    position: [0, -17, 0]
  });
  const welcomed = createKeyframeFromDelta(abovewater, {
    rotation: [0, Math.PI, 0],
    position: [0, -23, 0]
  });
  return {
    underwater,
    abovewater,
    welcomed
  }
}

export const interactions: IInteraction = {
  blueprint,
  animations: getAnimationData(animationKeyframes),
  events
}