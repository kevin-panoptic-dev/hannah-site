import * as assert from "./type";

function run(
    scene: assert.scene,
    camera: assert.camera,
    renderer: assert.renderer,
    container: assert.container,
    logic: assert.func
) {
    container.appendChild(renderer.domElement);

    let animationId: number;

    const animate = (time: number) => {
        logic(time);
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(animationId);
        renderer.domElement.remove();
    };
}

function resize(camera: assert.camera, renderer: assert.renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export { run, resize };
