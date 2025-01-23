import * as THREE from "three";
import {
    width,
    height,
    adjacent,
    opposite,
    angle,
    camerazhat,
    threshold,
    strength,
    dumpFactor,
} from "./constants";
import * as assert from "./type";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import styles from "./page.module.css";
import { resize } from "../orbit/controls";
import {
    generateStar,
    generatePlanet,
    generateBackground,
    generateAmbientLight,
    generateSunlight,
    generateSphere,
} from "./functions";
import { println, getPlanet, select } from "./methods";
import createCardElements from "./text";

let scene: assert.scene | undefined = undefined;
let camera: assert.camera | undefined = undefined;
let renderer: assert.renderer | undefined = undefined;

function usePage(
    container: assert.container,
    terminate: assert.callback,
    cards: assert.galleryCard[]
) {
    if (!scene || !camera || !renderer) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            angle,
            width / height,
            adjacent,
            opposite
        );
        renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    if (!scene || !camera || !renderer) {
        throw "The program runs successfully.";
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        1.5,
        0.4,
        100
    );
    const composer = new EffectComposer(renderer);

    bloomPass.threshold = threshold;
    bloomPass.strength = strength;
    bloomPass.radius = 0;
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    camera.position.z = camerazhat;
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    controls.enableDamping = true;
    controls.dampingFactor = dumpFactor;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.className = styles.background;

    // # # # # # # # # # # # # # # # # # # # # //
    const stars: assert.star[] = [];

    for (let _ = 0; _ < 200; _++) {
        const star = generateStar();
        stars.push(star);
    }

    const pool: string[] = ["1", "2", "3", "4", "5", "6"];
    const planets: assert.planet[] = [];
    const planetUrlCollection = getPlanet(pool, 2);

    for (const planetUrls of planetUrlCollection) {
        const planet = generatePlanet(...planetUrls);
        planets.push(planet);
    }

    const backgroundTexture = generateBackground("space.png");

    const ambientLight = generateAmbientLight();

    const sunLight = generateSunlight();

    const sphere = generateSphere();

    const card = select(cards);

    const [text, image] = createCardElements(card);

    // # # # # # # # # # # # # # # # # # # # # //

    scene.background = backgroundTexture;

    scene.add(ambientLight, sunLight, sphere, text, image);

    for (const star of stars) scene.add(star);

    for (const planet of planets) scene.add(planet);

    const run = (
        scene: assert.scene,
        camera: assert.camera,
        renderer: assert.renderer,
        container: assert.container
    ) => {
        container.appendChild(renderer.domElement);

        let animationId: number;

        const animate = () => {
            for (const planet of planets) planet.rotation.y += 0.05;

            for (const star of stars)
                star.scale.setScalar(
                    1 + 0.08 * (Math.random() - 0.45)
                );

            renderer.render(scene, camera);
            controls.update();
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            controls.dispose();
            composer.passes.forEach((pass) => {
                if (pass.dispose) pass.dispose();
            });
            scene.remove(ambientLight, sunLight, sphere, text, image);
            renderer.dispose();
            renderer.domElement.remove();
            scene.remove(ambientLight);
            for (const star of stars) scene.remove(star);
            for (const planet of planets) scene.remove(planet);
        };
    };

    const cleanup = run(scene, camera, renderer, container);

    window.addEventListener(
        "resize",
        () => resize(camera!, renderer!),
        false
    );
    window.addEventListener("mousedown", terminate, false);

    return () => {
        cleanup();
        window.removeEventListener(
            "resize",
            () => resize(camera!, renderer!),
            false
        );
        window.removeEventListener("mousedown", terminate, false);
    };
}

export default usePage;
