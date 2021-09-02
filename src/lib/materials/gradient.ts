import * as THREE from "three";

const gradient = (
  primary?: string,
  secondary?: string
): Pick<THREE.ShaderMaterial, 'uniforms' | 'vertexShader' | 'fragmentShader'> => {
  return {
    uniforms: {
      color1: {
        value: new THREE.Color(primary)
      },
      color2: {
        value: new THREE.Color(secondary)
      }
    },
    vertexShader: `
      varying vec3 vUv;
      void main() {
        vUv = position;
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.z), 1.0);
      }
    `
  }
}

export default gradient;