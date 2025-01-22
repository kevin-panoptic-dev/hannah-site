import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { galleryCard, ThreeType } from "./static/type";
import styles from "./styles/three.module.css";
import {
    generateStar,
    getBackground,
    getMoon,
    moveCamera,
} from "./static/functions";
import useOrbit from "./interface/orbit/orbit";

let scene: THREE.Scene | undefined = undefined;
let camera: THREE.PerspectiveCamera | undefined = undefined;
let renderer: THREE.WebGLRenderer | undefined = undefined;

function Three({ container, cards }: ThreeType) {
    // if (!scene || !camera || !renderer) {
    //     // WARN: node modules, don't tweak //
    //     scene = new THREE.Scene();
    //     camera = new THREE.PerspectiveCamera(
    //         75,
    //         container.clientWidth / container.clientHeight,
    //         0.1,
    //         1000
    //     );
    //     camera.position.setZ(30);
    //     renderer = new THREE.WebGLRenderer();
    //     renderer.setSize(
    //         container.clientWidth,
    //         container.clientHeight
    //     );
    //     renderer.setPixelRatio(window.devicePixelRatio);
    //     renderer.domElement.className = styles.background;
    //     container.appendChild(renderer.domElement);
    //     if (!scene || !camera || !renderer) {
    //         throw new Error("The operation performs successfully");
    //     }
    //     // WARN: node modules, don't tweak //
    //     for (let _ = 0; _ < 200; _++) {
    //         const star = generateStar(0.25, 100);
    //         scene.add(star);
    //     }
    //     scene.background = getBackground();
    //     const controls = new OrbitControls(
    //         camera,
    //         renderer.domElement
    //     );
    //     const moon = getMoon();
    //     scene.add(moon);
    //     const pointLight = new THREE.PointLight(0xffffff);
    //     pointLight.position.set(5, 5, 5);
    //     scene.add(pointLight);
    //     const ambientLight = new THREE.AmbientLight(0xffffff);
    //     scene.add(ambientLight);
    //     const lightHelper = new THREE.PointLightHelper(pointLight);
    //     scene.add(lightHelper);
    //     const gridHelper = new THREE.GridHelper(200, 50);
    //     scene.add(gridHelper);
    //     const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    //     const material = new THREE.MeshStandardMaterial({
    //         color: 0xff6347,
    //     });
    //     const torus = new THREE.Mesh(geometry, material);
    //     scene.add(torus);
    //     document.body.onscroll = () => {
    //         moveCamera(camera!, moon);
    //     };
    //     const animate = () => {
    //         if (scene && camera && renderer) {
    //             requestAnimationFrame(animate);
    //             torus.rotation.x += 0.01;
    //             torus.rotation.y += 0.005;
    //             torus.rotation.z += 0.01;
    //             controls.update();
    //             renderer.render(scene, camera);
    //         } else {
    //             throw new Error(
    //                 "The operation performs successfully"
    //             );
    //         }
    //     };
    //     animate();
    // }

    const signalContent = () => {
        cleanupOrbit();
    };

    const cleanupOrbit = useOrbit(container, signalContent);
}

export default Three;
