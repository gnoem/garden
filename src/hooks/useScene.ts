import { useEffect, useState } from "react";
import * as THREE from "three";
import { Loop, CameraControls, RoughnessMipmapper, objects, RGBELoader, WatchCursorControls } from "@lib";
import { IThreeScene } from "@types";
import { transformObject } from "@utils";

const { Water } = objects;

const useScene = (sceneRef: HTMLElement | null): IThreeScene => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const [scene, setScene] = useState<IThreeScene>({
    scene: null,
    camera: null,
    renderer: null,
    loop: null
  });

  useEffect(() => {
    if (!sceneRef || isSet) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    const loop = new Loop(scene, camera, renderer);
    addLighting(scene);
    addWater(scene, loop);
    addEnvironmentTexture(scene, renderer);
    scene.userData = {
      canvas: sceneRef
    }
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    camera.position.set(0, 0, 10);
    addCameraControls(scene, camera, renderer, loop);
    //addWatchCursor(scene, camera);
    setScene({ scene, camera, renderer, loop });
    loop.start();
    sceneRef.appendChild(renderer.domElement);
    setIsSet(true);
  }, [isSet, sceneRef]);

  return scene;
}

const addWatchCursor = (scene: THREE.Scene, camera: THREE.Camera): WatchCursorControls => {
  const controls = new WatchCursorControls(camera);
  scene.userData.enableWatchCursor = (object: THREE.Group | THREE.Mesh): void => {
    if (!object) return;
    controls.add(object);
    controls.connect();
  }
  return controls;
}

const addCameraControls = (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, loop: Loop): CameraControls => {
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

const addLighting = (scene: THREE.Scene): void => {
  const primaryLight = new THREE.DirectionalLight( 0xffffff, 1 );
  const secondaryLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
  transformObject.position(primaryLight, [50, 0, 0]);
  transformObject.position(secondaryLight, [-50, 0, 0]);
  primaryLight.shadow.bias = 0.001;
  primaryLight.shadow.normalBias = 0.003;
  scene.add( primaryLight );
  //scene.add( secondaryLight ); // preserves texture in shadowed areas
  //scene.add( ambientLight );
}

const addEnvironmentTexture = (scene: THREE.Scene, renderer: THREE.WebGLRenderer): void => {
  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    // @ts-ignore
    .setPath('textures/')
    .load('pinksunset.hdr', (texture: THREE.Texture): void => {

      const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      // use of RoughnessMipmapper is optional
      const roughnessMipmapper = new RoughnessMipmapper(renderer);
      roughnessMipmapper.dispose();
    });
}

const addWater = (scene: THREE.Scene, loop: Loop) => {
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

export default useScene;