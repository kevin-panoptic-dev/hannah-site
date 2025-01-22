import * as THREE from "three";

function useEllipse(
    a: number = 20,
    b: number = 10,
    segments: number = 100
): THREE.CatmullRomCurve3 {
    const points: THREE.Vector3[] = [];
    const step = (2 * Math.PI) / segments;

    for (let i = 0; i <= segments; i++) {
        const t = i * step;
        points.push(
            new THREE.Vector3(
                a * Math.cos(t),
                b * Math.sin(t),
                Math.cos(t) % 0.2 // INFO: generate a big float, then normalize it
                // INFO: c does not do anything, through, in theory
            )
        );
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    return curve;
}

export default useEllipse;
