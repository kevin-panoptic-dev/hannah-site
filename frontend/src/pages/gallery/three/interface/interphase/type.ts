import * as THREE from "three";

type container = HTMLElement;

type callback = () => void;

type renderer = THREE.WebGLRenderer;

type camera = THREE.OrthographicCamera;

type scene = THREE.Scene;

type outline = THREE.LineSegments;

type func = (time: number) => void;

type tube = THREE.TubeGeometry;

type resize = (
    camera: THREE.PerspectiveCamera,
    render: THREE.WebGLRenderer
) => void;

type bar = THREE.Mesh;

export type {
    container,
    callback,
    renderer,
    camera,
    scene,
    outline,
    func,
    tube,
    resize,
    bar,
};
