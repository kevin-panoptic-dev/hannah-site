import * as THREE from "three";
import { starColorVariants } from "./constants";
import { select, tilt } from "./methods";
import * as assert from "./type";

function generateStar(radius: number = 0.25, distance: number = 100) {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);

    const starColor = select(starColorVariants);

    const material = new THREE.MeshPhongMaterial({
        color: starColor,
        emissive: starColor,
        emissiveIntensity: 0.3,
        shininess: 50,
    });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill(undefined)
        .map(() => THREE.MathUtils.randFloatSpread(distance));

    star.position.set(x, y, z);

    const scale = THREE.MathUtils.randFloat(0.5, 1.5);
    star.scale.set(scale, scale, scale);

    return star;
}

function generatePlanet(main: string, color: string, normal: string) {
    const loader = new THREE.TextureLoader();
    const mainImage = loader.load(main);
    const colorMap = loader.load(color);
    const normalMap = loader.load(normal);

    const group = new THREE.Group();

    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const material = new THREE.MeshStandardMaterial({
        map: mainImage,
        normalMap: normalMap,
    });

    const colorMaterial = new THREE.MeshBasicMaterial({
        map: colorMap,
        blending: THREE.AdditiveBlending,
    });

    const baseMesh = new THREE.Mesh(geometry, material);
    const colorMesh = new THREE.Mesh(geometry, colorMaterial);

    group.add(baseMesh, colorMesh);
    group.rotation.z = tilt();

    return group;
}

function generateBackground(url: string) {
    const loader = new THREE.TextureLoader();
    const spaceTexture = loader.load(url);
    return spaceTexture;
}

function generateAmbientLight(intensity: number = 0.2) {
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity);
    return ambientLight;
}

function generateSunlight(
    color: number = 0xffffff,
    intensity: number = 1,
    distance: number = 0,
    decay: number = 1,
    position: THREE.Vector3 = new THREE.Vector3(0, 1000, 1000)
) {
    const light = new THREE.PointLight(
        color,
        intensity,
        distance,
        decay
    );
    light.position.copy(position);
    return light;
}

import {
    Group,
    Mesh,
    SphereGeometry,
    MeshStandardMaterial,
    ConeGeometry,
    Vector3,
} from "three";

const DEFAULT_OPTIONS: assert.generateSphereType = {
    radius: 10,
    widthSegments: 32,
    heightSegments: 32,
    color: "#ff00ff",
    spikeCount: 50,
    spikeHeight: 2,
    spikeBaseRadius: 0.5,
};

function createSphereMaterial(
    color: string | number
): MeshStandardMaterial {
    return new MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.2,
    });
}

function generateRandomPointOnSphere(radius: number): Vector3 {
    const vector = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    ).normalize();
    return vector.multiplyScalar(radius);
}

function createSpike(
    position: Vector3,
    height: number,
    baseRadius: number,
    color: string | number
): Mesh {
    const geometry = new ConeGeometry(baseRadius, height, 8);
    const material = new MeshStandardMaterial({ color });
    const spike = new Mesh(geometry, material);
    spike.position.copy(position);
    spike.lookAt(new Vector3(0, 0, 0));
    return spike;
}

function generateSphere(options: assert.generateSphereType = {}) {
    const {
        radius,
        widthSegments,
        heightSegments,
        color,
        spikeCount,
        spikeHeight,
        spikeBaseRadius,
    } = { ...DEFAULT_OPTIONS, ...options };

    const group = new Group();
    const geometry = new SphereGeometry(
        radius,
        widthSegments,
        heightSegments
    );
    const material = createSphereMaterial(color!);
    const sphere = new Mesh(geometry, material);
    group.add(sphere);

    for (let i = 0; i < spikeCount!; i++) {
        const position = generateRandomPointOnSphere(radius!);
        const spike = createSpike(
            position,
            spikeHeight!,
            spikeBaseRadius!,
            0x00ff00
        );
        group.add(spike);
    }

    return group;
}

export {
    generateStar,
    generatePlanet,
    generateBackground,
    generateAmbientLight,
    generateSunlight,
    generateSphere,
};
