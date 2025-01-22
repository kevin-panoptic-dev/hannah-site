import * as THREE from "three";
import { starColorVariants } from "./constants";
import { select } from "./methods";

function getBackground() {
    const spaceTexture = new THREE.TextureLoader().load("space.png");

    return spaceTexture;
}

function moveCamera(
    camera: THREE.PerspectiveCamera,
    element: THREE.Mesh<
        THREE.SphereGeometry,
        THREE.MeshStandardMaterial,
        THREE.Object3DEventMap
    >
) {
    const position = document.body.getBoundingClientRect().top;
    element.rotateX(0.05);
    element.rotateY(0.075);
    element.rotateZ(0.05);

    camera.position.x = position * 0.01;
}

function getMoon(): THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
> {
    const moonTexture = new THREE.TextureLoader().load("moon.png");
    const normalTexture = new THREE.TextureLoader().load(
        "mountain.png"
    );

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
            normalMap: normalTexture,
        })
    );

    return moon;
}

function generateStar(
    radius: number,
    distance: number
): THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshPhongMaterial,
    THREE.Object3DEventMap
> {
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

export { generateStar, getBackground, getMoon, moveCamera };
