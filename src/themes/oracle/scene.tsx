import { CameraControls, Loop, Water } from "@lib";
import { transformObject } from "@utils";
import * as THREE from "three";

export const addCameraControls = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, loop: Loop): CameraControls => {
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

export const addLighting = (scene: THREE.Scene): void => {
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 1 );
  const secondaryLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
  transformObject.position(primaryLight, [50, 0, 0]);
  transformObject.position(secondaryLight, [-50, 0, 0]);
  primaryLight.shadow.bias = 0.001;
  primaryLight.shadow.normalBias = 0.003;
  scene.add(primaryLight);
  //scene.add( secondaryLight ); // preserves texture in shadowed areas
  //scene.add( ambientLight );
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