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
        renderer = new THREE.WebGLRenderer({ antialias: true });
    }
    if (!scene || !camera || !renderer) {
        throw "The program runs successfully";
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.className = styles.background;
    camera.position.z = 10;

    // # # # # # # # # # # # # # # # # # # # # //

    const colorFamily = chooseColor();
    scene.background = new THREE.Color(pickColor(colorFamily));
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
        const color = pickColor(chooseColor());
        const [x, y] = positions(
            index + 1,
            barWidth,
            horizontalBarNumber,
            barHeight
        );
        const bar = createBar(color, x, y);
        bars.push(bar);
    }

    const moveBar = (bar: assert.bar) => {
        bar.position.x -= horizontalSpeed;
        bar.position.y += verticalSpeed;
    };

    for (const bar of bars) {
        scene.add(bar);
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
            if (bars) {
                for (let index = 0; index < bars.length; index++) {
                    const bar = bars[index];
                    // if (index < horizontalBarNumber) {
                    //     if (
                    //         !(
                    //             bar.position.y +
                    //                 (Math.sqrt(2) / 2) * barHeight >
                    //             (-1 / 2) * window.innerHeight - 10
                    //         )
                    //     ) {
                    //         moveBar(bar);
                    //     }
                    // } else {
                    //     if (
                    //         !(
                    //             bar.position.x -
                    //                 (Math.sqrt(2) / 2) * barHeight <
                    //             (1 / 2) * window.innerWidth + 10
                    //         )
                    //     ) {
                    //         moveBar(bar);
                    //     }
                    // }
                    moveBar(bar);
                }
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            renderer.domElement.remove();
            renderer.dispose();
            if (bars) {
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
            }
        };
    };

    const cleanup = run(scene, camera, renderer, container);

    setTimeout(terminate, 2000);

    return cleanup;
}

export default useInterphase;
