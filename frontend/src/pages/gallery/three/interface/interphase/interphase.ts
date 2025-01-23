import styles from "./interphase.module.css";
import * as THREE from "three";
import * as assert from "./type";
import { chooseColor, pickColor, positions } from "./functions";
import {
    horizontalBarNumber,
    verticalBarNumber,
    barWidth,
    barHeight,
    horizontalSpeed,
    verticalSpeed,
} from "./constants";

let scene: assert.scene | undefined = undefined;
let camera: assert.camera | undefined = undefined;
let renderer: assert.renderer | undefined = undefined;

function useInterphase(
    container: assert.container,
    terminate: assert.callback
) {
    if (!scene || !camera || !renderer) {
        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            0.1,
            1000
        );
    }
    if (!scene || !camera || !renderer) {
        throw "The program runs successfully";
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.className = styles.background;
    camera.position.z = 10;

    // # # # # # # # # # # # # # # # # # # # # //

    const colorFamily = chooseColor();
    const bars: assert.bar[] = [];

    const createBar = (color: number, x: number, y: number) => {
        const geometry = new THREE.PlaneGeometry(barWidth, barHeight);
        const material = new THREE.MeshBasicMaterial({
            color: color,
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(x, y, 0);
        bar.rotation.z = Math.PI / 4;
        return bar;
    };

    // INFO: x: Horizontal axis.
    // INFO: •	Positive values move the bar to the right.
    // INFO: •	Negative values move the bar to the left.
    // INFO: y: Vertical axis.
    // INFO: •	Positive values move the bar upward.
    // INFO: •	Negative values move the bar downward

    for (
        let index = 0;
        index <= horizontalBarNumber + verticalBarNumber;
        index++
    ) {
        const color = pickColor(colorFamily);
        const [x, y] = positions(
            index + 1,
            barWidth,
            horizontalBarNumber
        );

        const bar = createBar(color, x, y);
        bars.push(bar);
    }

    for (const bar of bars) {
        setTimeout(() => scene!.add(bar), 100);
    }

    // # # # # # # # # # # # # # # # # # # # # //

    const run = (
        scene: assert.scene,
        camera: assert.camera,
        renderer: assert.renderer,
        container: assert.container
    ) => {
        container.appendChild(renderer.domElement);

        let animationId: number;

        const animate = () => {
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
            for (const bar of bars) {
                bar.position.x += horizontalSpeed;
                bar.position.y += verticalSpeed;
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            renderer.domElement.remove();
            renderer.dispose();
            for (const bar of bars) {
                bar.geometry.dispose();
                if (Array.isArray(bar.material)) {
                    for (const mat of bar.material) {
                        mat.dispose();
                    }
                } else {
                    bar.material.dispose();
                }
                scene.remove(bar);
            }
        };
    };

    const cleanup = run(scene, camera, renderer, container);

    setTimeout(() => terminate(), 5000000000);

    return cleanup;
}

export default useInterphase;
