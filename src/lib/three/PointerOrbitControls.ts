// failed attempt at modified orbitcontrols

import { ISimpleObject, SceneObject } from "@types";
import * as THREE from "three";

const _changeEvent = {
	type: 'change'
}

class PointerOrbitControls extends THREE.EventDispatcher {

	update: () => void;
	connect: () => void;
	disconnect: () => void;
	userData: ISimpleObject;
	object: SceneObject | THREE.Camera;
	name: string;
	domElement: HTMLElement;
	enabled: boolean;
	target: THREE.Vector3;
	minDistance: number;
	maxDistance: number;
	minPolarAngle: number;
	maxPolarAngle: number;
	minAzimuthAngle: number;
	maxAzimuthAngle: number;
	enableDamping: boolean;
	dampingFactor: number;
	rotateSpeed: number;

	constructor(camera: THREE.Camera, domElement: HTMLElement) {

		super();

		this.object = camera;
		this.name = 'pointercontrols';
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out (PerspectiveCamera only)
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [min, max] must be a sub-interval of [- 2 PI, 2 PI], with (max - min < 2 PI)
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;
		this.rotateSpeed = 1;	
		
		const scope = this;

		const EPS = 0.000001;

		// current position in spherical coordinates
		const spherical = new THREE.Spherical();
		const sphericalDelta = new THREE.Spherical();

		let scale = 1;
		const panOffset = new THREE.Vector3();
		let zoomChanged = false;

		const rotateStart = new THREE.Vector2();
		const rotateEnd = new THREE.Vector2();
		const rotateDelta = new THREE.Vector2();

		const pointers = [];
		const pointerPositions = {};

		const rotateLeft = (angle) => {

			sphericalDelta.theta -= angle;

		}

		const rotateUp = (angle) => {

			sphericalDelta.phi -= angle;

		}

		const handleRotate = (e) => {

			let x, y, speed = scope.rotateSpeed;

			if (e.pointerType === 'touch') {
				x = e.pageX;
				y = e.pageY;
				speed *= 10;
			} else {
				x = e.clientX;
				y = e.clientY;
			}

			rotateEnd.set(x, y);

			rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(speed);
			
			const element = scope.domElement;
			
			rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
			
			rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
			
			rotateStart.copy(rotateEnd);
// on touchscreen,
//mouseup rotateEnd (coords) should become the new rotateStart
		}

		const onPointerDown = (e) => {
			pointers.push(e);

			if (e.pointerType === 'touch') {
				rotateStart.set(e.pageX, e.pageY);
			}

		}

		const onPointerUp = (e) => {
			delete pointerPositions[e.pointerId];

			for (let i = 0; i < pointers.length; i++) {
				if (pointers[i].pointerId === e.pointerId) {
					pointers.splice(i, 1);
				}
			}

		}

		const onPointerMove = (e) => {

			if (scope.enabled === false) return;

			handleRotate(e);

		}

		const offset = new THREE.Vector3();
		// so camera.up is the orbit axis
		const quat = new THREE.Quaternion().setFromUnitVectors(scope.object.up, new THREE.Vector3(0, 1, 0));
		const quatInverse = quat.clone().invert();
		const lastPosition = new THREE.Vector3();
		const lastQuaternion = new THREE.Quaternion();
		const twoPI = 2 * Math.PI;

		this.update = () => {

			const position = scope.object.position;

			offset.copy(position).sub(scope.target);

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);

			// angle from z-axis around y-axis
			spherical.setFromVector3(offset);

			if (scope.enableDamping) {

				spherical.theta += sphericalDelta.theta * scope.dampingFactor;
				spherical.phi += sphericalDelta.phi * scope.dampingFactor;

			} else {

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

			}

			// restrict theta to be between desired limits

			let min = scope.minAzimuthAngle;
			let max = scope.maxAzimuthAngle;

			if (isFinite(min) && isFinite(max)) {

				if (min < - Math.PI) min += twoPI; else if (min > Math.PI) min -= twoPI;

				if (max < - Math.PI) max += twoPI; else if (max > Math.PI) max -= twoPI;

				if (min <= max) {

					spherical.theta = Math.max(min, Math.min(max, spherical.theta));

				} else {

					spherical.theta = (spherical.theta > (min + max) / 2) ?
						Math.max(min, spherical.theta) :
						Math.min(max, spherical.theta);

				}

			}

			// restrict phi to be between desired limits
			spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

			// move target to panned location

			if (scope.enableDamping === true) {

				scope.target.addScaledVector(panOffset, scope.dampingFactor);

			} else {

				scope.target.add(panOffset);

			}

			offset.setFromSpherical(spherical);

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);

			position.copy(scope.target).add(offset);

			scope.object.lookAt(scope.target);

			if (scope.enableDamping === true) {

				sphericalDelta.theta *= (1 - scope.dampingFactor);
				sphericalDelta.phi *= (1 - scope.dampingFactor);

				panOffset.multiplyScalar(1 - scope.dampingFactor);

			} else {

				sphericalDelta.set(0, 0, 0);

				panOffset.set(0, 0, 0);

			}

			scale = 1;

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if (
				zoomChanged ||
				lastPosition.distanceToSquared(scope.object.position) > EPS ||
				8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS
			) {

				// @ts-ignore
				scope.dispatchEvent(_changeEvent);

				lastPosition.copy(scope.object.position);
				lastQuaternion.copy(scope.object.quaternion);
				zoomChanged = false;

				return true;

			}

			return false;

		}

		this.connect = () => {
			document.body.addEventListener('pointerdown', onPointerDown);
			document.body.addEventListener('pointerup', onPointerUp);
			document.body.addEventListener('pointercancel', onPointerUp);
			document.body.addEventListener('pointermove', onPointerMove);
		}
		
		this.disconnect = () => {
			document.body.removeEventListener('pointerdown', onPointerDown);
			document.body.removeEventListener('pointerup', onPointerUp);
			document.body.removeEventListener('pointercancel', onPointerUp);
			document.body.removeEventListener('pointermove', onPointerMove);
		}

		this.userData = {
			tick: this.update,
			disconnect: this.disconnect
		}
		
	}

}

export default PointerOrbitControls;