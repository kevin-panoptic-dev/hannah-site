import * as assert from "./type";
import * as THREE from "three";
import { Font } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/Addons.js";

let defaultFont: Font;

const fontPath =
    "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json";

function initializeDefaultFont() {
    new FontLoader().load(fontPath, (loadedFont) => {
        defaultFont = loadedFont;
    });
}

function truncate(description: string): string {
    const sanitizedText = description.replace(/\s+/g, " ").trim();
    return sanitizedText.length > 200
        ? `${sanitizedText.slice(0, 197)}...`
        : sanitizedText;
}

function createTextElement({
    content,
    verticalOffset,
    fontSize,
    font,
    color,
}: assert.createTextType): THREE.Mesh {
    const geometry = new TextGeometry(content, {
        font,
        size: fontSize,
        height: 0.01,
    });
    const material = new THREE.MeshBasicMaterial({ color });
    const textMesh = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    textMesh.position.set(0, verticalOffset, 0);
    return textMesh;
}

function createImageElement(
    path: string,
    dimensions: THREE.Vector3
): THREE.Mesh {
    const texture = new THREE.TextureLoader().load(path);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const geometry = new THREE.PlaneGeometry(
        dimensions.x,
        dimensions.y
    );
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createCardElements = (
    card: assert.galleryCard,
    options: assert.createCardType = {}
): [THREE.Group, THREE.Mesh] => {
    const {
        textPosition = new THREE.Vector3(0, 0, 0),
        titleFontSize = 0.4,
        descriptionFontSize = 0.3,
        font = defaultFont,
        imageSize = new THREE.Vector3(5, 3, 0.1),
        textColor = "#ffffff",
    } = options;

    const textGroup = new THREE.Group();
    textGroup.position.copy(textPosition);

    const titleMesh = createTextElement({
        content: card.title,
        verticalOffset: 0.6,
        fontSize: titleFontSize,
        font,
        color: textColor,
    });

    const descriptionMesh = createTextElement({
        content: truncate(card.description),
        verticalOffset: 0,
        fontSize: descriptionFontSize,
        font,
        color: textColor,
    });

    textGroup.add(titleMesh, descriptionMesh);
    const imageElement = createImageElement(card.image, imageSize);
    return [textGroup, imageElement];
};

initializeDefaultFont();

export default createCardElements;
