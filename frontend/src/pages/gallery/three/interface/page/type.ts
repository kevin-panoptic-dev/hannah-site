import * as THREE from "three";
import { Font } from "three/examples/jsm/Addons.js";

type container = HTMLElement;

type callback = () => void;

type renderer = THREE.WebGLRenderer;

type camera = THREE.PerspectiveCamera;

type scene = THREE.Scene;

type outline = THREE.LineSegments;

type func = (time: number) => void;

type tube = THREE.TubeGeometry;

type resize = (
    camera: THREE.PerspectiveCamera,
    render: THREE.WebGLRenderer
) => void;

type star = THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshPhongMaterial,
    THREE.Object3DEventMap
>;

type planet = THREE.Group<THREE.Object3DEventMap>;

type font = Font;

interface generateSphereType {
    radius?: number;
    widthSegments?: number;
    heightSegments?: number;
    color?: string | number;
    spikeCount?: number;
    spikeHeight?: number;
    spikeBaseRadius?: number;
}

interface galleryCard {
    id: number;
    title: string;
    description: string;
    image: string;
}

interface createTextType {
    content: string;
    verticalOffset: number;
    fontSize: number;
    font: font;
    color: string;
}

interface createCardType {
    textPosition?: THREE.Vector3;
    titleFontSize?: number;
    descriptionFontSize?: number;
    font?: Font;
    imageSize?: THREE.Vector3;
    textColor?: string;
}

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
    star,
    planet,
    generateSphereType,
    galleryCard,
    createTextType,
    createCardType,
};
