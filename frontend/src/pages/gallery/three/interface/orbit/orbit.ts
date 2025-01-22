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
    limit,
    boxSize,
} from "./constants";
import * as assert from "./type";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import styles from "./orbit.module.css";
import { run, resize } from "./controls";
import useEllipse from "./ellipse";

let scene: assert.scene | undefined = undefined;
let camera: assert.camera | undefined = undefined;
let renderer: assert.renderer | undefined = undefined;

function useOrbit(
    container: assert.container,
    terminate: assert.callback
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

    const ellipsePath = useEllipse();
    const tube = new THREE.TubeGeometry(
        ellipsePath,
        222,
        0.65,
        16,
        true
    );
    const edges = new THREE.EdgesGeometry(tube, 0.2);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const result = new THREE.LineSegments(edges, material);

    const constructor = new THREE.BoxGeometry(
        boxSize,
        boxSize,
        boxSize
    );
    const boxes: assert.outline[] = [];

    for (let i = 0; i < limit; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        });
        const box = new THREE.Mesh(constructor, material);
        const point = (i / limit + Math.random() * 0.1) % 1;
        const position = tube.parameters.path.getPointAt(point);
        position.x += Math.random() - 0.45;
        position.z += Math.random() - 0.45;
        box.position.copy(position);
        const rote = new THREE.Vector3(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        box.rotation.set(rote.x, rote.y, rote.z);

        const edges = new THREE.EdgesGeometry(constructor, 0.2);
        const color = new THREE.Color().setHSL(0.7 - point, 1, 0.5);
        const lineMaterial = new THREE.LineBasicMaterial({ color });
        const outline = new THREE.LineSegments(edges, lineMaterial);
        outline.position.copy(position);
        outline.rotation.set(rote.x, rote.y, rote.z);
        boxes.push(outline);
    }

    let x = 1;
    let index = 0;

    const setCamera = (
        time: number,
        camera: assert.camera,
        tube: THREE.TubeGeometry
    ) => {
        // INFO: Linear
        const amplitude = (5 * 1000 * 1) / x;
        x += 0.001;
        const point = ((time * 0.1) % amplitude) / amplitude;
        const current = tube.parameters.path.getPointAt(point);
        const lookAt = tube.parameters.path.getPointAt(
            (point + 0.02) % 1
        );
        camera.position.copy(current);
        camera.lookAt(lookAt);

        const then = (point + 0.04) % 1;
        const future = tube.parameters.path.getPointAt(then);
        const threshold = 200; // INFO: the second (real) transformation warning

        const predict = (y1: number, y2: number) => {
            return Math.abs(y1 - y2) >= 2.7 ? 1 : 0;
        };

        index += predict(current.y, future.y);

        index >= threshold && terminate();

        // if (Math.random() >= 0.99) {
        //     console.log("Current Value:");
        //     console.log(
        //         current.x.toFixed(4),
        //         current.y.toFixed(4),
        //         current.z.toFixed(4)
        //     );
        //     console.log("Future Value:");
        //     console.log(
        //         future.x.toFixed(4),
        //         future.y.toFixed(4),
        //         future.z.toFixed(4)
        //     );
        //     // console.log("Product: ");
        //     // console.log(transformation);
        // }
    };

    // # # # # # # # # # # # # # # # # # # # # //

    for (const outline of boxes) {
        scene.add(outline);
    }
    scene.add(result);

    const cleanup = run(scene, camera, renderer, container, (time) =>
        setCamera(time, camera!, tube)
    );

    window.addEventListener(
        "resize",
        () => resize(camera!, renderer!),
        false
    );

    window.addEventListener("mousedown", terminate, false);

    return () => {
        window.removeEventListener(
            "resize",
            () => resize(camera!, renderer!),
            false
        );
        window.removeEventListener("mousedown", terminate, false);
        setTimeout(() => {
            cleanup();
            controls.dispose();

            composer.passes.forEach((pass) => {
                if (pass.dispose) pass.dispose();
            });

            boxes.forEach((outline) => {
                scene!.remove(outline);
                outline.geometry.dispose();
                (outline.material as THREE.Material).dispose();
            });
            scene!.remove(result);
            result.geometry.dispose();
            (result.material as THREE.Material).dispose();
            tube.dispose();
            constructor.dispose();
            material.dispose();
            renderer!.dispose();
            renderer!.domElement.remove();
        }, 1000);
    };
}

export default useOrbit;
