import * as THREE from "three";
import { CameraControls, Loop, Water } from "@lib";
import { IThreeScene } from "@types";

export const addCameraControls = ({ scene, camera, renderer, loop }: IThreeScene): CameraControls => {
  const controls = new CameraControls(camera, renderer.domElement);
  controls.setBoundaries({
    x: [-1000, 1000],
    y: [10, 10],
    z: [-1000, 1000],
  });
  //controls.connect();
  scene.userData.enableCameraControls = (enableControls: boolean = true): void => {
    if (enableControls) controls.connect();
    else controls.dispose();
  }
  loop.add(controls);
  return controls;
}

export const addWater = (scene: THREE.Scene, loop: Loop) => {
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture: THREE.Texture): void => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  });
  // @ts-ignore
  water.position.y = -5;
  // @ts-ignore
  water.rotation.x = -Math.PI / 2;
  water.userData.tick = (): void => {
    const waterMaterial = water.material;
    (waterMaterial as THREE.ShaderMaterial).uniforms['time'].value += 1.0 / 60.0;
  }
  loop.add(water);
  scene.add(water);
  return water;
}